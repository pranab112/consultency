-- Quick SQL to create all tables
-- Copy and paste this in Railway PostgreSQL Query tab

CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'Student',
  phone VARCHAR(50),
  "profilePicture" TEXT,
  "isActive" BOOLEAN DEFAULT true,
  "lastLogin" TIMESTAMP WITH TIME ZONE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "userId" UUID REFERENCES users(id),
  "firstName" VARCHAR(255) NOT NULL,
  "lastName" VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  "dateOfBirth" DATE,
  gender VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  country VARCHAR(100),
  "postalCode" VARCHAR(20),
  "passportNumber" VARCHAR(100),
  "educationLevel" VARCHAR(100),
  "fieldOfStudy" VARCHAR(255),
  "englishProficiency" VARCHAR(50),
  "testScores" JSONB,
  "preferredCountries" TEXT[],
  "preferredCourses" TEXT[],
  budget DECIMAL(10, 2),
  "intakeYear" INTEGER,
  "intakeSeason" VARCHAR(50),
  "applicationStatus" VARCHAR(50) DEFAULT 'New',
  "assignedAgent" UUID REFERENCES users(id),
  notes TEXT,
  documents JSONB,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "userId" UUID REFERENCES users(id),
  "studentId" UUID REFERENCES students(id),
  type VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'Pending',
  priority VARCHAR(20) DEFAULT 'Medium',
  "dueDate" DATE,
  "completedAt" TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert admin user
INSERT INTO users (email, password, name, role, "isActive")
VALUES (
  'admin@studyabroad.com',
  '$2a$10$8KXZpTnQqFLRQ5.YZPzD6OqQxJVhLPWqvJXeKPxGOqnqjrF0nwt5G',
  'System Administrator',
  'Admin',
  true
) ON CONFLICT (email) DO NOTHING;

-- Check tables
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';