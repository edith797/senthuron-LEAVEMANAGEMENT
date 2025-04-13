import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LeaveApproved = () => {
  const [approved, setApproved] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/leave/status/Approved')
      .then(res => setApproved(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Approved Leaves</h2>
      <table className="styled-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Emp ID</th>
            <th>Type</th>
            <th>From</th>
            <th>To</th>
            <th>Reason</th>
          </tr>
        </thead>
        <tbody>
  {approved.map(leave => (
    <tr key={leave._id}>
      <td>{leave.name}</td>
      <td>{leave.employeeId}</td>
      <td>{leave.type}</td>
      <td>{new Date(leave.fromDate).toLocaleDateString()}</td>
      <td>{new Date(leave.toDate).toLocaleDateString()}</td>
      <td>{leave.reason}</td>
    </tr>
  ))}
</tbody>

      </table>
    </div>
  );
};

export default LeaveApproved;
