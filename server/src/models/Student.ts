import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database.js';

interface StudentAttributes {
  id: string;
  userId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: Date;
  nationality?: string;
  preferredCountries?: string[];
  preferredCourses?: string[];
  educationLevel?: string;
  englishProficiency?: string;
  budget?: string;
  status: 'Lead' | 'Prospect' | 'Applied' | 'Enrolled' | 'Rejected' | 'On Hold';
  assignedAgent?: string;
  source?: string;
  notes?: string;
  documents?: any;
  testScores?: any;
  applicationStatus?: any;
  createdAt?: Date;
  updatedAt?: Date;
}

interface StudentCreationAttributes extends Optional<StudentAttributes, 'id' | 'status' | 'createdAt' | 'updatedAt'> {}

class Student extends Model<StudentAttributes, StudentCreationAttributes> implements StudentAttributes {
  declare id: string;
  declare userId?: string;
  declare firstName: string;
  declare lastName: string;
  declare email: string;
  declare phone: string;
  declare dateOfBirth?: Date;
  declare nationality?: string;
  declare preferredCountries?: string[];
  declare preferredCourses?: string[];
  declare educationLevel?: string;
  declare englishProficiency?: string;
  declare budget?: string;
  declare status: 'Lead' | 'Prospect' | 'Applied' | 'Enrolled' | 'Rejected' | 'On Hold';
  declare assignedAgent?: string;
  declare source?: string;
  declare notes?: string;
  declare documents?: any;
  declare testScores?: any;
  declare applicationStatus?: any;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Student.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    nationality: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    preferredCountries: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    preferredCourses: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    educationLevel: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    englishProficiency: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    budget: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('Lead', 'Prospect', 'Applied', 'Enrolled', 'Rejected', 'On Hold'),
      defaultValue: 'Lead',
    },
    assignedAgent: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    source: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    documents: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    testScores: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    applicationStatus: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Student',
    tableName: 'students',
  }
);

export default Student;