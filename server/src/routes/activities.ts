import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import Activity from '../models/Activity.js';
import User from '../models/User.js';
import Student from '../models/Student.js';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';

const router = express.Router();

// Get all activities
router.get('/', authenticate, async (req: any, res) => {
  try {
    let where: any = {};

    // If user is an Agent, only show their activities
    if (req.user.role === 'Agent') {
      where.userId = req.user.id;
    }

    // If user is a Student, don't allow access
    if (req.user.role === 'Student') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { userId, studentId, action, startDate, endDate } = req.query;

    if (userId) {
      where.userId = userId;
    }

    if (studentId) {
      where.studentId = studentId;
    }

    if (action) {
      where.action = action;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        where.createdAt[Op.lte] = new Date(endDate);
      }
    }

    const activities = await Activity.findAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'role'],
        },
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: 100,
    });

    res.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ message: 'Failed to fetch activities' });
  }
});

// Get activity statistics (Admin only)
router.get('/stats', authenticate, authorize('Admin'), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let where: any = {};
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt[Op.gte] = new Date(startDate as string);
      }
      if (endDate) {
        where.createdAt[Op.lte] = new Date(endDate as string);
      }
    }

    // Count activities by action
    const actionStats = await Activity.findAll({
      where,
      attributes: [
        'action',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['action'],
    });

    // Count activities by user
    const userStats = await Activity.findAll({
      where,
      attributes: [
        'userId',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      include: [{
        model: User,
        as: 'user',
        attributes: ['name', 'email'],
      }],
      group: ['userId', 'user.id'],
    });

    res.json({
      actionStats,
      userStats,
    });
  } catch (error) {
    console.error('Error fetching activity stats:', error);
    res.status(500).json({ message: 'Failed to fetch statistics' });
  }
});

// Create activity log
router.post('/', authenticate, async (req: any, res) => {
  try {
    const activity = await Activity.create({
      ...req.body,
      userId: req.user.id,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    res.status(201).json(activity);
  } catch (error) {
    console.error('Error creating activity:', error);
    res.status(500).json({ message: 'Failed to create activity' });
  }
});

export default router;