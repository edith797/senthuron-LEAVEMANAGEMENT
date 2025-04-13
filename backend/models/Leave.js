const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  employeeId: String,
  name: String,
  fromDate: Date,
  toDate: Date,
  reason: String,
  type: String,
  status: { type: String, default: 'Pending' },
  comment: String, // ✅ New field for admin comment
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Leave', leaveSchema);
