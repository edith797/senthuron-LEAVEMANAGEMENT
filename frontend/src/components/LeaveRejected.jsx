import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LeaveRejected = () => {
  const [rejected, setRejected] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/leave/status/Rejected')
      .then(res => setRejected(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Rejected Leaves</h2>
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
          {rejected.map(leave => (
            <tr key={leave._id}>
              <td>{leave.name}</td>
              <td>{leave.empId}</td>
              <td>{leave.leaveType}</td>
              <td>{leave.fromDate}</td>
              <td>{leave.toDate}</td>
              <td>{leave.reason}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveRejected;
