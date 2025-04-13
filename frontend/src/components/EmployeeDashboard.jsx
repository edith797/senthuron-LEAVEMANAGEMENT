import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './EmployeeDashboard.css';

const EmployeeDashboard = () => {
  const [status, setStatus] = useState({
    totalApplied: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    available: 12,
  });

  const [recentLeaves, setRecentLeaves] = useState([]);

  useEffect(() => {
    const employeeId = localStorage.getItem('employeeId');

    if (employeeId) {
      axios.get('http://localhost:5000/api/leave/my-leaves', { withCredentials: true })
        .then(res => {
          const leaves = res.data;
          console.log("Leaves fetched:", leaves); // Debug

          let total = leaves.length;
          let approved = 0;
          let pending = 0;
          let rejected = 0;
          let approvedDays = 0;
          let pendingDays = 0;

          leaves.forEach(leave => {
            const from = new Date(leave.fromDate);
            const to = new Date(leave.toDate);
            const days = Math.max(1, Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1);

            const status = leave.status.toLowerCase();

            if (status === 'approved') {
              approved++;
              approvedDays += days;
            } else if (status === 'pending') {
              pending++;
              pendingDays += days;
            } else if (status === 'rejected') {
              rejected++;
            }
          });

          const available = 12 - approvedDays - pendingDays;

          setStatus({
            totalApplied: total,
            approved,
            pending,
            rejected,
            available: available < 0 ? 0 : available
          });

          setRecentLeaves(leaves.slice(0, 5));
        })
        .catch(err => console.error(err));
    }
  }, []);

  return (
    <div className="employee-dashboard">
      <h2 className="dashboard-title">Dashboard</h2>
      <p className="dashboard-subtitle">Overview of your leave status</p>

      <div className="dashboard-cards">
        <div className="card available">
          <div className="icon">&#128197;</div>
          <div>
            <p>Available Leaves</p>
            <h3>{status.available}</h3>
          </div>
        </div>
        <div className="card approved">
          <div className="icon">&#10003;</div>
          <div>
            <p>Approved Leaves</p>
            <h3>{status.approved}</h3>
          </div>
        </div>
        <div className="card pending">
          <div className="icon">&#9200;</div>
          <div>
            <p>Pending Leaves</p>
            <h3>{status.pending}</h3>
          </div>
        </div>
      </div>

      <div className="dashboard-bottom">
        <div className="leave-status">
          <h3>Leave Status</h3>
          <div className="leave-total">Total <strong>{status.totalApplied}</strong></div>
          <div className="legend">
            <span className="approved-dot"></span> Approved ({status.approved})
            <span className="pending-dot"></span> Pending ({status.pending})
            <span className="rejected-dot"></span> Rejected ({status.rejected})
          </div>
        </div>

        <div className="recent-leaves">
          <h3>Recent Leave Applications</h3>
          {recentLeaves.length === 0 ? (
            <div className="no-data">No leave requests found</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Leave Type</th>
                  <th>Date</th>
                  <th>Days</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentLeaves.map(leave => {
                  const from = new Date(leave.fromDate);
                  const to = new Date(leave.toDate);
                  const days = Math.max(1, Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1);

                  return (
                    <tr key={leave._id}>
                      <td>{leave.type}</td>
                      <td>{from.toLocaleDateString()} - {to.toLocaleDateString()}</td>
                      <td>{days}</td>
                      <td className={`status ${leave.status.toLowerCase()}`}>{leave.status}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
