import { User, AgencySettings, Country } from '../types';
import apiService from './api';

let currentUserCache: User | null = null;

// Helper to get user from localStorage
const getLocalUser = (): User | null => {
    const stored = localStorage.getItem('sag_current_user');
    return stored ? JSON.parse(stored) : null;
};

export const login = async (email: string, password: string): Promise<User | null> => {
    try {
        // Try to login via backend API first
        const response = await apiService.login(email, password);

        if (response && response.user) {
            currentUserCache = response.user;
            localStorage.setItem('sag_current_user', JSON.stringify(response.user));
            return response.user;
        }
    } catch (error) {
        console.error('Backend login failed:', error);

        // Fallback to demo mode for development
        if (email === 'admin@demo.com' && password === 'password') {
            const MOCK_ADMIN: User = {
                id: 'mock-admin-id',
                name: 'Demo Admin',
                email: 'admin@demo.com',
                role: 'Owner',
                agencyId: 'mock-agency-id'
            };
            currentUserCache = MOCK_ADMIN;
            localStorage.setItem('sag_current_user', JSON.stringify(MOCK_ADMIN));
            return MOCK_ADMIN;
        }

        // Also check backend default admin
        if (email === 'admin@studyabroad.com' && password === 'admin123') {
            // Let the backend handle this
            throw error;
        }
    }

    throw new Error("Invalid credentials");
};

export const registerAgency = async (
    name: string,
    email: string,
    agencyName: string,
    password?: string
): Promise<User> => {
    try {
        // Register via backend API
        const response = await apiService.register({
            name,
            email,
            password: password || 'password123',
            phone: ''
        });

        if (response && response.user) {
            currentUserCache = response.user;
            localStorage.setItem('sag_current_user', JSON.stringify(response.user));

            // Save agency settings
            const defaultSettings: AgencySettings = {
                agencyName: agencyName,
                email: email,
                phone: '',
                address: '',
                defaultCountry: Country.Australia,
                currency: 'NPR',
                notifications: { emailOnVisa: true, dailyReminders: true },
                subscription: { plan: 'Free' }
            };
            localStorage.setItem(`sag_settings_${response.user.id}`, JSON.stringify(defaultSettings));

            return response.user;
        }
    } catch (error) {
        console.error('Backend registration failed:', error);

        // Fallback to local storage for demo
        const newId = Date.now().toString();
        const mockUser = {
            id: newId,
            name,
            email,
            role: 'Owner' as const,
            agencyId: `agency_${newId}`,
        };

        const localUsers = JSON.parse(localStorage.getItem('sag_users') || '[]');
        localUsers.push({ ...mockUser, password: password || 'password123' });
        localStorage.setItem('sag_users', JSON.stringify(localUsers));

        currentUserCache = mockUser;
        localStorage.setItem('sag_current_user', JSON.stringify(mockUser));
        return mockUser;
    }

    throw new Error("Registration failed");
};

export const logout = async () => {
    currentUserCache = null;
    localStorage.removeItem('sag_current_user');
    apiService.clearToken();
    window.location.reload();
};

export const getCurrentUser = (): User | null => {
    if (!currentUserCache) {
        currentUserCache = getLocalUser();
    }
    return currentUserCache;
};

export const initAuthListener = (callback: (user: User | null) => void) => {
    // Check for existing user on mount
    const user = getLocalUser();
    currentUserCache = user;

    // If we have a token but no user, try to fetch user from backend
    const token = localStorage.getItem('authToken');
    if (token && !user) {
        apiService.getCurrentUser()
            .then(response => {
                if (response && response.user) {
                    currentUserCache = response.user;
                    localStorage.setItem('sag_current_user', JSON.stringify(response.user));
                    callback(response.user);
                } else {
                    callback(null);
                }
            })
            .catch(() => {
                callback(null);
            });
    } else {
        callback(user);
    }

    return () => {};
};