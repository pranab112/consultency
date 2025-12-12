import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let sequelize: Sequelize;

// Debug logging
console.log('🔍 Database Configuration:');
console.log('  - DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('  - DB_TYPE:', process.env.DB_TYPE || 'not set');
console.log('  - NODE_ENV:', process.env.NODE_ENV || 'not set');

// Check if we have a DATABASE_URL (Railway/Heroku style connection string)
if (process.env.DATABASE_URL) {
  console.log('  ✅ Using DATABASE_URL for connection');
  // Use connection string for production databases
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: process.env.NODE_ENV === 'production' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: false
    }
  });
} else if (process.env.DB_TYPE === 'postgres') {
  console.log('  ⚠️ Using individual PostgreSQL parameters (not DATABASE_URL)');
  // PostgreSQL configuration with individual parameters
  sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'studyabroad',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: false
    }
  });
} else {
  // SQLite configuration for local development
  console.log('  📦 Using SQLite for local development');
  const dbPath = process.env.DB_PATH || path.join(__dirname, '../../database.sqlite');

  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
      timestamps: true,
      underscored: false
    }
  });
}

export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    const dbType = process.env.DATABASE_URL ? 'postgres (via DATABASE_URL)' :
                   process.env.DB_TYPE === 'postgres' ? 'postgres (individual params)' : 'sqlite';
    console.log(`✅ Database connection established (${dbType})`);
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    return false;
  }
};

export default sequelize;