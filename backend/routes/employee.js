const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// Get all employees
router.get('/', async (req, res) => {
  const employees = await Employee.find();
  res.json(employees);
});

// Add new employee
router.post('/', async (req, res) => {
  const { firstName, lastName, email, password, employeeId, position } = req.body;

  const existing = await Employee.findOne({ email });
  if (existing) {
    return res.status(400).json({ message: 'Email already exists' });
  }

  const newEmployee = new Employee({
    firstName,
    lastName,
    email,
    password,
    employeeId,
    position,
  });

  await newEmployee.save();
  res.json({ success: true, message: 'Employee created' });
});

module.exports = router;
