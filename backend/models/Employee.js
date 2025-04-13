const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
  employeeId: String,
  position: String,
  role: { type: String, default: 'employee' },
});

module.exports = mongoose.model('Employee', employeeSchema);
