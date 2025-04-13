import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
    password: '',
    role: 'STAFF',
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:5000/api/users/register', formData);
      alert('Employee added!');
    } catch (err) {
      alert('Failed to add employee');
    }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        <h3>Add New Employee</h3>
        <input name="name" onChange={handleChange} placeholder="Name" />
        <input name="email" onChange={handleChange} placeholder="Email" />
        <input name="mobile" onChange={handleChange} placeholder="Mobile" />
        <input name="address" onChange={handleChange} placeholder="Address" />
        <input name="password" type="password" onChange={handleChange} placeholder="Password" />
        <select name="role" onChange={handleChange}>
          <option value="STAFF">STAFF</option>
          <option value="HOD">HOD</option>
        </select>
        <button onClick={handleSubmit}>Add</button>
      </div>
    </div>
  );
};

export default AddEmployee;
