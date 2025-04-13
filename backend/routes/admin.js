const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const Leave = require('../models/Leave');

// Dashboard Summary Route
router.get('/summary', async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    const totalLeaves = await Leave.countDocuments();
    const pendingLeaves = await Leave.countDocuments({ status: 'Pending' });
    const approvedLeaves = await Leave.countDocuments({ status: 'Approved' });
    const rejectedLeaves = await Leave.countDocuments({ status: 'Rejected' });

    res.json({
      totalEmployees,
      totalLeaves,
      pendingLeaves,
      approvedLeaves,
      rejectedLeaves,
    });
  } catch (err) {
    console.error('Dashboard summary error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
