const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// Admin Login (Hardcoded)
router.post('/admin-login', (req, res) => {
  const { email, password } = req.body;

  if (email === 'admin@gmail.com' && password === 'admin123') {
    req.session.isAdmin = true;

    // Optional: reset other sessions
    req.session.employeeId = null;

    return res.json({ success: true, role: 'admin' });
  }

  return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
});

// Employee Login
router.post('/employee-login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const emp = await Employee.findOne({ email, password });

    if (!emp) {
      return res.status(401).json({ success: false, message: 'Invalid employee credentials' });
    }

    req.session.employeeId = emp._id;

    // Optional: reset admin session
    req.session.isAdmin = false;

    return res.json({ success: true, role: 'employee', employee: emp });
  } catch (err) {
    console.error('Employee login error:', err);
    return res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

// Check current session (who is logged in)
router.get('/check-session', (req, res) => {
  if (req.session.isAdmin) {
    return res.json({ loggedIn: true, role: 'admin' });
  } else if (req.session.employeeId) {
    return res.json({ loggedIn: true, role: 'employee', employeeId: req.session.employeeId });
  } else {
    return res.json({ loggedIn: false });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Logout failed' });
    }
    res.clearCookie('connect.sid'); // Clear session cookie
    return res.json({ success: true, message: 'Logged out successfully' });
  });
});

module.exports = router;
