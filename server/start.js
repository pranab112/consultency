#!/usr/bin/env node

// Production startup script with ES module support
console.log('🚀 Starting StudyAbroad server...');
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('Port:', process.env.PORT || 5000);
console.log('Database URL:', process.env.DATABASE_URL ? '✅ Set' : '❌ Not set');

// Debug: Show first part of DATABASE_URL to verify format
if (process.env.DATABASE_URL) {
  const urlParts = process.env.DATABASE_URL.split('@');
  if (urlParts.length > 1) {
    console.log('Database Host:', urlParts[1].split('/')[0]);
  }
}

console.log('DB_TYPE:', process.env.DB_TYPE || 'not set');

// Import the ES module server
import('./dist/index.js').catch(error => {
  console.error('❌ Failed to start server:', error);
  console.error('Stack trace:', error.stack);
  process.exit(1);
});