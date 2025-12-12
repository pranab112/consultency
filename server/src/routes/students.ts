import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate, authorize } from '../middleware/auth.js';
import Student from '../models/Student.js';
import Activity from '../models/Activity.js';
import { Op } from 'sequelize';

const router = express.Router();

// Get all students
router.get('/', authenticate, async (req: any, res) => {
  try {
    let where: any = {};

    // If user is an Agent, only show their assigned students
    if (req.user.role === 'Agent') {
      where.assignedAgent = req.user.id;
    }

    // If user is a Student, only show their own record
    if (req.user.role === 'Student') {
      where.userId = req.user.id;
    }

    const { status, search } = req.query;

    if (status) {
      where.status = status;
    }

    if (search) {
      where[Op.or] = [
        { firstName: { [Op.like]: `%${search}%` } },
        { lastName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    const students = await Student.findAll({
      where,
      order: [['createdAt', 'DESC']],
    });

    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Failed to fetch students' });
  }
});

// Get student by ID
router.get('/:id', authenticate, async (req: any, res) => {
  try {
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check permissions
    if (req.user.role === 'Agent' && student.assignedAgent !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (req.user.role === 'Student' && student.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(student);
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ message: 'Failed to fetch student' });
  }
});

// Create student (Admin and Agent only)
router.post(
  '/',
  authenticate,
  authorize('Admin', 'Agent'),
  [
    body('firstName').notEmpty(),
    body('lastName').notEmpty(),
    body('email').isEmail().normalizeEmail(),
    body('phone').notEmpty(),
  ],
  async (req: any, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const studentData = {
        ...req.body,
        assignedAgent: req.user.role === 'Agent' ? req.user.id : req.body.assignedAgent,
      };

      const student = await Student.create(studentData);

      // Log activity
      await Activity.create({
        userId: req.user.id,
        studentId: student.id,
        action: 'CREATE_STUDENT',
        description: `Created new student: ${student.firstName} ${student.lastName}`,
      });

      res.status(201).json(student);
    } catch (error) {
      console.error('Error creating student:', error);
      res.status(500).json({ message: 'Failed to create student' });
    }
  }
);

// Update student
router.put(
  '/:id',
  authenticate,
  [
    body('email').optional().isEmail().normalizeEmail(),
  ],
  async (req: any, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const student = await Student.findByPk(req.params.id);
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }

      // Check permissions
      if (req.user.role === 'Agent' && student.assignedAgent !== req.user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }

      if (req.user.role === 'Student' && student.userId !== req.user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }

      await student.update(req.body);

      // Log activity
      await Activity.create({
        userId: req.user.id,
        studentId: student.id,
        action: 'UPDATE_STUDENT',
        description: `Updated student: ${student.firstName} ${student.lastName}`,
        metadata: req.body,
      });

      res.json(student);
    } catch (error) {
      console.error('Error updating student:', error);
      res.status(500).json({ message: 'Failed to update student' });
    }
  }
);

// Delete student (Admin only)
router.delete('/:id', authenticate, authorize('Admin'), async (req: any, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Log activity before deletion
    await Activity.create({
      userId: req.user.id,
      action: 'DELETE_STUDENT',
      description: `Deleted student: ${student.firstName} ${student.lastName}`,
    });

    await student.destroy();
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ message: 'Failed to delete student' });
  }
});

// Public lead form submission (no auth required)
router.post(
  '/public/lead',
  [
    body('firstName').notEmpty(),
    body('lastName').notEmpty(),
    body('email').isEmail().normalizeEmail(),
    body('phone').notEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const student = await Student.create({
        ...req.body,
        status: 'Lead',
        source: 'Public Form',
      });

      res.status(201).json({
        message: 'Thank you for your interest! We will contact you soon.',
        id: student.id,
      });
    } catch (error) {
      console.error('Error creating lead:', error);
      res.status(500).json({ message: 'Failed to submit form' });
    }
  }
);

export default router;