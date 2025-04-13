const express = require('express');
const router = express.Router();
const Leave = require('../models/Leave');
const Employee = require('../models/Employee');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

/**
 * Apply leave (for employee)
 */
router.post('/apply', upload.single('document'), async (req, res) => {
  console.log('Apply leave session:', req.session);

  try {
    const { type, fromDate, toDate, reason } = req.body;

    if (!req.session.employeeId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const employee = await Employee.findById(req.session.employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    if (!type || !fromDate || !toDate || !reason) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Enforce sick leave limit
    if (type === 'sick') {
      const startOfYear = new Date(new Date().getFullYear(), 0, 1);
      const endOfYear = new Date(new Date().getFullYear(), 11, 31);
      const sickLeaveCount = await Leave.countDocuments({
        employeeId: employee._id,
        type: 'sick',
        fromDate: { $gte: startOfYear, $lte: endOfYear },
      });

      if (sickLeaveCount >= 12) {
        return res.status(400).json({ message: 'Sick leave limit (12 per year) reached.' });
      }
    }

    const leave = new Leave({
      employeeId: employee._id,
      name: `${employee.firstName} ${employee.lastName}`,
      type,
      fromDate,
      toDate,
      reason,
      status: 'Pending',
      createdAt: new Date(),
      documentPath: req.file ? req.file.path : null,
    });

    await leave.save();
    res.json({ success: true });
  } catch (err) {
    console.error('Leave Apply Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * View own leaves
 */
router.get('/my-leaves', async (req, res) => {
  console.log('My Leaves session:', req.session);

  if (!req.session.employeeId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const leaves = await Leave.find({ employeeId: req.session.employeeId }).sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) {
    console.error('Fetch My Leaves Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Admin - View all leave requests with filters
 */
router.get('/all', async (req, res) => {
  try {
    const { name, status, from, to, sort } = req.query;
    const query = {};

    if (name) {
      query.name = { $regex: new RegExp(name, 'i') };
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (from || to) {
      query.fromDate = {};
      if (from) query.fromDate.$gte = new Date(from);
      if (to) query.fromDate.$lte = new Date(to);
    }

    const sortOption = sort === 'oldest' ? 1 : -1;

    const leaves = await Leave.find(query).sort({ createdAt: sortOption });
    res.json(leaves);
  } catch (err) {
    console.error('Fetch Leave Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Admin - Approve/Reject leave request
 */
router.put('/status/:id', async (req, res) => {
  const { status, comment } = req.body;

  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: 'Leave not found' });
    }

    leave.status = status;
    if (comment) {
      leave.comment = comment;
    }

    await leave.save();
    res.json({ success: true });
  } catch (err) {
    console.error('Update Leave Status Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Admin - Get leaves by status
 */
router.get('/status/:status', async (req, res) => {
  try {
    const leaves = await Leave.find({ status: req.params.status }).sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) {
    console.error('Fetch by Status Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Admin - Recent leave requests
 */
router.get('/recent', async (req, res) => {
  try {
    const leaves = await Leave.find().sort({ createdAt: -1 }).limit(5);
    res.json(leaves);
  } catch (err) {
    console.error('Recent Leaves Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
