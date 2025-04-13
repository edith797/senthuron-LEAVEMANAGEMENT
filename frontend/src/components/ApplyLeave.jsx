// frontend/src/components/ApplyLeave.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './ApplyLeave.css';

const ApplyLeave = () => {
  const [form, setForm] = useState({
    type: '',
    fromDate: '',
    toDate: '',
    reason: '',
  });
  const [numDays, setNumDays] = useState(0);
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };
    setForm(updatedForm);

    if (name === 'fromDate' || name === 'toDate') {
      const from = new Date(updatedForm.fromDate);
      const to = new Date(updatedForm.toDate);
      if (from && to && from <= to) {
        const diff = Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;
        setNumDays(diff);
      } else {
        setNumDays(0);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    if (file) data.append('document', file);

    try {
      const res = await axios.post('http://localhost:5000/api/leave/apply', data, {
        withCredentials: true, // ⬅️ Important to send session cookie!
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Leave request submitted');
      setForm({ type: '', fromDate: '', toDate: '', reason: '' });
      setFile(null);
      setNumDays(0);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        alert('Unauthorized. Please login again.');
      } else {
        alert('Error submitting leave. Try again later.');
      }
      console.error('Leave Apply Error:', err);
    }
  };

  return (
    <div className="apply-leave-container">
      <h2>Apply for Leave</h2>
      <p className="subtitle">Submit a new leave request</p>
      <form onSubmit={handleSubmit} className="leave-form">
        <div className="form-row">
          <div className="form-group">
            <label>Leave Type</label>
            <select name="type" value={form.type} onChange={handleChange} required>
              <option value="">Select Leave Type</option>
              <option value="casual">Casual</option>
              <option value="sick">Sick</option>
              <option value="earned">Earned</option>
            </select>
          </div>
          <div className="form-group">
            <label>Number of Days: <strong>{numDays}</strong></label>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>From Date</label>
            <input type="date" name="fromDate" value={form.fromDate} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>To Date</label>
            <input type="date" name="toDate" value={form.toDate} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-group">
          <label>Reason for Leave</label>
          <textarea
            name="reason"
            value={form.reason}
            onChange={handleChange}
            placeholder="Please provide a detailed reason for your leave request"
            required
          />
        </div>

        <div className="form-group">
          <label>Supporting Document (Optional)</label>
          <input type="file" onChange={e => setFile(e.target.files[0])} />
          <small>PDF, DOC, or DOCX up to 5MB</small>
        </div>

        <button type="submit" className="submit-btn">Submit Leave Request</button>
      </form>
    </div>
  );
};

export default ApplyLeave;
