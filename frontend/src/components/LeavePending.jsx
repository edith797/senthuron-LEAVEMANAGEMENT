import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LeavePending = () => {
  const [pending, setPending] = useState([]);

  const fetchPending = () => {
    axios.get('http://localhost:5000/api/leave/status/Pending')
      .then(res => setPending(res.data))
      .catch(err => console.error(err));
  };

  const handleAction = async (id, status) => {
    await axios.put(`http://localhost:5000/api/leave/${id}`, { status });
    fetchPending();
  };

  useEffect(() => {
    fetchPending();
  }, []);

  return (
    <div>
      <h2>Pending Leaves</h2>
      <table className="styled-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Emp ID</th>
            <th>Type</th>
            <th>From</th>
            <th>To</th>
            <th>Reason</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pending.map(leave => (
            <tr key={leave._id}>
              <td>{leave.name}</td>
              <td>{leave.empId}</td>
              <td>{leave.leaveType}</td>
              <td>{leave.fromDate}</td>
              <td>{leave.toDate}</td>
              <td>{leave.reason}</td>
              <td>
                <button onClick={() => handleAction(leave._id, 'Approved')} className="btn-approve">Approve</button>
                <button onClick={() => handleAction(leave._id, 'Rejected')} className="btn-reject">Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeavePending;
