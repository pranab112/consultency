# StudyAbroad Management System

A comprehensive CRM and management system for study abroad agencies.

## Features

- Student Management (CRM)
- AI-powered Tools
- Operations Dashboard
- Partner Management
- Analytics & Reporting
- Test Prep Hub
- Activity Tracking
- Multi-role Support (Admin, Agent, Student)

## Tech Stack

### Frontend
- React 19 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Recharts for data visualization

### Backend
- Node.js with Express
- TypeScript
- Sequelize ORM
- SQLite (local development)
- PostgreSQL (production)
- JWT authentication

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/smediamanagement84-star/STUDYABROAD.git
cd STUDYABROAD
```

2. Install all dependencies:
```bash
npm run install:all
```

This will install dependencies for both frontend and backend.

### Database Configuration

#### Local Development (SQLite)
The application uses SQLite by default for local development. No additional setup required.

#### Production (PostgreSQL)
To use PostgreSQL in production, update the environment variables in `server/.env`:

```env
DB_TYPE=postgres
DB_HOST=your-postgres-host
DB_PORT=5432
DB_NAME=studyabroad
DB_USER=your-username
DB_PASSWORD=your-password
```

### Running the Application

#### Development Mode

To run both frontend and backend simultaneously:
```bash
npm run dev:all
```

Or run them separately:

Frontend only:
```bash
npm run dev
```

Backend only:
```bash
npm run dev:backend
```

#### Production Build

```bash
npm run build:all
```

### Default Credentials

The system creates a default admin account on first run:
- Email: `admin@studyabroad.com`
- Password: `admin123`

**Important:** Change these credentials after first login!

### API Endpoints

The backend server runs on `http://localhost:5000` by default.

Key endpoints:
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/students` - Get all students
- `POST /api/students` - Create new student
- `GET /api/activities` - Get activity logs

### Environment Variables

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_AI_API_KEY=your-google-ai-api-key
```

#### Backend (server/.env)
See `server/.env.example` for all available options.

### Folder Structure

```
STUDYABROAD/
├── components/             # React components
├── services/              # API and service layers
├── server/                # Backend server
│   ├── src/
│   │   ├── config/       # Database configuration
│   │   ├── models/       # Sequelize models
│   │   ├── routes/       # API routes
│   │   └── middleware/   # Express middleware
│   └── package.json
├── types.ts              # TypeScript type definitions
└── package.json          # Frontend package.json
```

## Development Notes

- The application supports both local storage (demo mode) and full backend integration
- Authentication uses JWT tokens stored in localStorage
- File uploads are stored in `server/uploads/` directory
- The system automatically creates necessary database tables on startup

## License

MIT License - See LICENSE.md for details
