
import { Student, Partner, Invoice, Task, AgencySettings, CommissionClaim, Expense, Country, ApplicationStatus, NocStatus } from '../types';
import { getCurrentUser } from './authService';
import { MOCK_STUDENTS_INITIAL, MOCK_PARTNERS_INITIAL } from '../constants';
import apiService from './api';

const getAgencyId = () => {
    const user = getCurrentUser();
    // Use user id as agency id for now
    return user ? (user.agencyId || user.id || 'default') : null;
};

// --- GENERIC FETCH ---
const fetchCollection = async <T>(collectionName: string): Promise<T[]> => {
    const agencyId = getAgencyId();
    if (!agencyId) return [];

    // Local Storage Mode (Fallback)
    const key = `sag_${collectionName}_${agencyId}`;
    const stored = localStorage.getItem(key);
    
    // Return Mock Data if empty and it's the first run
    if (!stored) {
        // Automatically seed data for the demo admin
        if (agencyId === 'mock-agency-id') {
            if (collectionName === 'students') return MOCK_STUDENTS_INITIAL as unknown as T[];
            if (collectionName === 'partners') return MOCK_PARTNERS_INITIAL as unknown as T[];
        }
        return [];
    }
    
    return JSON.parse(stored);
};

// --- GENERIC SAVE ---
const saveCollection = async (collectionName: string, items: any[]) => {
    const agencyId = getAgencyId();
    if (!agencyId) throw new Error("No Agency ID");

    const key = `sag_${collectionName}_${agencyId}`;
    localStorage.setItem(key, JSON.stringify(items));
};

export const fetchStudents = async (): Promise<Student[]> => {
    try {
        // Try to fetch from API first
        const apiStudents = await apiService.getStudents();

        // Map API response to frontend format
        if (apiStudents && Array.isArray(apiStudents)) {
            return apiStudents.map((s: any) => ({
                id: s.id,
                name: `${s.firstName} ${s.lastName}`,
                email: s.email,
                phone: s.phone,
                targetCountry: s.preferredCountries?.[0] || Country.USA,
                status: mapApiStatusToApplicationStatus(s.status),
                nocStatus: NocStatus.NotApplied,
                documents: {},
                notes: s.notes || '',
                createdAt: new Date(s.createdAt).getTime(),
                nationality: s.nationality,
                dateOfBirth: s.dateOfBirth,
                address: s.address,
                educationLevel: s.educationLevel,
                englishProficiency: s.englishProficiency,
                budget: s.budget,
            }));
        }
        return [];
    } catch (error) {
        console.log('Falling back to local storage for students');
        return fetchCollection<Student>("students");
    }
};

// Helper function to map API status to ApplicationStatus
const mapApiStatusToApplicationStatus = (apiStatus: string): ApplicationStatus => {
    const statusMap: Record<string, ApplicationStatus> = {
        'Lead': ApplicationStatus.Lead,
        'Applied': ApplicationStatus.Applied,
        'Enrolled': ApplicationStatus.OfferReceived,
        'Rejected': ApplicationStatus.VisaRejected,
    };
    return statusMap[apiStatus] || ApplicationStatus.Lead;
};

export const saveStudents = async (students: Student[]): Promise<void> => {
    // Save to localStorage for now (API updates handled separately)
    return saveCollection("students", students);
};

export const fetchPartners = async (): Promise<Partner[]> => fetchCollection<Partner>("partners");
export const savePartners = async (partners: Partner[]): Promise<void> => saveCollection("partners", partners);

export const fetchInvoices = async (): Promise<Invoice[]> => fetchCollection<Invoice>("invoices");
export const saveInvoices = async (invoices: Invoice[]): Promise<void> => saveCollection("invoices", invoices);

export const fetchExpenses = async (): Promise<Expense[]> => fetchCollection<Expense>("expenses");
export const saveExpenses = async (expenses: Expense[]): Promise<void> => saveCollection("expenses", expenses);

export const fetchTasks = async (): Promise<Task[]> => fetchCollection<Task>("tasks");
export const saveTasks = async (tasks: Task[]): Promise<void> => saveCollection("tasks", tasks);

export const fetchClaims = async (): Promise<CommissionClaim[]> => fetchCollection<CommissionClaim>("claims");
export const saveClaims = async (claims: CommissionClaim[]): Promise<void> => saveCollection("claims", claims);

export const fetchSettings = async (): Promise<AgencySettings> => {
    const agencyId = getAgencyId();
    if (!agencyId) return {} as AgencySettings;

    const key = `sag_settings_${agencyId}`;
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);

    return {
        agencyName: 'StudyAbroad Genius',
        email: 'info@studyabroadgenius.com',
        phone: '',
        address: '',
        defaultCountry: Country.Australia,
        currency: 'NPR',
        notifications: { emailOnVisa: true, dailyReminders: true },
        subscription: { plan: 'Free' }
    };
};

export const saveSettings = async (settings: AgencySettings): Promise<void> => {
    const agencyId = getAgencyId();
    if (!agencyId) return;
    
    const key = `sag_settings_${agencyId}`;
    localStorage.setItem(key, JSON.stringify(settings));
};

export const fetchAllData = async () => {
    const [students, partners, invoices, expenses, tasks, claims, settings] = await Promise.all([
        fetchStudents(), fetchPartners(), fetchInvoices(), fetchExpenses(), fetchTasks(), fetchClaims(), fetchSettings()
    ]);
    return {
        students, partners, invoices, expenses, tasks, claims, settings,
        exportedAt: new Date().toISOString()
    };
};

export const importData = async (jsonString: string): Promise<boolean> => {
    try {
        const data = JSON.parse(jsonString);
        if (data.students) await saveStudents(data.students);
        if (data.partners) await savePartners(data.partners);
        if (data.invoices) await saveInvoices(data.invoices);
        if (data.expenses) await saveExpenses(data.expenses);
        if (data.tasks) await saveTasks(data.tasks);
        if (data.claims) await saveClaims(data.claims);
        if (data.settings) await saveSettings(data.settings);
        return true;
    } catch (e) {
        console.error("Import failed", e);
        return false;
    }
};

export const clearAllData = async () => {
    const agencyId = getAgencyId();
    if (!agencyId) return;
    
    const collections = ['students', 'partners', 'invoices', 'expenses', 'tasks', 'claims', 'settings'];
    collections.forEach(col => localStorage.removeItem(`sag_${col}_${agencyId}`));
    
    console.log("Local data cleared.");
};
