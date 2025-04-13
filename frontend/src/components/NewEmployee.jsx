import React, { useState } from 'react';
import axios from 'axios';
import './NewEmployee.css';

const NewEmployee = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    empId: '',
    email: '',
    position: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return alert("Passwords do not match");
    }
    try {
      await axios.post('http://localhost:5000/api/employee', {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        employeeId: form.empId,
        position: form.position,
        password: form.password
      });
      
      alert('Employee added successfully!');
      setForm({
        firstName: '',
        lastName: '',
        empId: '',
        email: '',
        position: '',
        password: '',
        confirmPassword: '',
      });
    } catch (err) {
      alert('Error adding employee');
    }
  };

  return (
    <div className="new-employee-container">
      <h2 className="title">Add New Employee</h2>
      <p className="subtitle">Create a new employee account</p>

      <form className="employee-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>First Name</label>
            <input type="text" name="firstName" placeholder="Enter first name" value={form.firstName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input type="text" name="lastName" placeholder="Enter last name" value={form.lastName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" placeholder="Enter email address" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Employee ID</label>
            <input type="text" name="empId" placeholder="Enter employee ID" value={form.empId} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Position</label>
            <input type="text" name="position" placeholder="Enter position" value={form.position} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" placeholder="Enter password" value={form.password} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input type="password" name="confirmPassword" placeholder="Confirm password" value={form.confirmPassword} onChange={handleChange} required />
          </div>
        </div>
        <button type="submit" className="submit-btn">✓ Add Employee</button>
      </form>
    </div>
  );
};

export default NewEmployee;
