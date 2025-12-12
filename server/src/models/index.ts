import sequelize from '../config/database.js';
import User from './User.js';
import Student from './Student.js';
import Activity from './Activity.js';

// Define associations
User.hasMany(Student, {
  foreignKey: 'userId',
  as: 'students',
});

Student.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

User.hasMany(Student, {
  foreignKey: 'assignedAgent',
  as: 'assignedStudents',
});

Student.belongsTo(User, {
  foreignKey: 'assignedAgent',
  as: 'agent',
});

User.hasMany(Activity, {
  foreignKey: 'userId',
  as: 'activities',
});

Activity.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

Student.hasMany(Activity, {
  foreignKey: 'studentId',
  as: 'activities',
});

Activity.belongsTo(Student, {
  foreignKey: 'studentId',
  as: 'student',
});

export {
  sequelize,
  User,
  Student,
  Activity,
};