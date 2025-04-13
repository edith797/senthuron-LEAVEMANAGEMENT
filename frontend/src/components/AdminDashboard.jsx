import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const AdminDashboard = () => {
  const [summary, setSummary] = useState({
    totalEmployees: 0,
    totalLeaves: 0,
    pendingLeaves: 0,
    approvedLeaves: 0,
    rejectedLeaves: 0,
  });

  const [recentLeaves, setRecentLeaves] = useState([]);

  useEffect(() => {
    // Fetch dashboard summary
    axios.get('http://localhost:5000/api/admin/summary', { withCredentials: true })
      .then(res => setSummary(res.data))
      .catch(err => console.error(err));

    // Fetch recent leaves
    axios.get('http://localhost:5000/api/leave/recent', { withCredentials: true })
      .then(res => setRecentLeaves(res.data.slice(0, 5)))
      .catch(err => console.error(err));
  }, []);

  const pieData = {
    labels: ['Approved', 'Pending', 'Rejected'],
    datasets: [
      {
        data: [
          summary.approvedLeaves,
          summary.pendingLeaves,
          summary.rejectedLeaves
        ],
        backgroundColor: ['#4CAF50', '#FFC107', '#F44336'],
        borderColor: ['#ffffff', '#ffffff', '#ffffff'],
        borderWidth: 2,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div className="admin-dashboard">
      <h2 className="dashboard-title" > Admin Dashboard</h2>
      <p className="dashboard-subtitle">Overview of leave management system</p>

      <div className="dashboard-cards">
        <div className="card approved">
          <div className="card-icon">&#10003;</div>
          <div>
            <p>Approved Leaves</p>
            <h3>{summary.approvedLeaves}</h3>
          </div>
        </div>
        <div className="card pending">
          <div className="card-icon">&#9200;</div>
          <div>
            <p>Pending Leaves</p>
            <h3>{summary.pendingLeaves}</h3>
          </div>
        </div>
        <div className="card rejected">
          <div className="card-icon">&#10060;</div>
          <div>
            <p>Rejected Leaves</p>
            <h3>{summary.rejectedLeaves}</h3>
          </div>
        </div>
      </div>

      <div className="dashboard-lower">
        <div className="status-overview">
          <h3>Leave Status Overview</h3>
          <Pie data={pieData} options={pieOptions} />
          <p className="total-label">Total Leaves: {summary.totalLeaves}</p>
        </div>

        <div className="recent-requests">
          <h3>Recent Leave Requests</h3>
          {recentLeaves.length === 0 ? (
            <div className="no-data">No leave requests found</div>
          ) : (
            <ul className="recent-list">
              {recentLeaves.map(leave => {
                const from = new Date(leave.fromDate).toLocaleDateString();
                const to = new Date(leave.toDate).toLocaleDateString();
                return (
                  <li key={leave._id} className={`recent-item ${leave.status.toLowerCase()}`}>
                    <div><strong>{leave.name}</strong> - {leave.type} Leave</div>
                    <div>{from} to {to}</div>
                    <div>Status: <span className="status-text">{leave.status}</span></div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
