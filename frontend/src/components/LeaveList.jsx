import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LeaveList = () => {
  const [leaves, setLeaves] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    status: 'All',
    from: '',
    to: '',
    sort: 'recent',
  });

  const fetchLeaves = async () => {
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await axios.get(`http://localhost:5000/api/leave/all?${query}`);
      setLeaves(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [filters]);

  const handleStatusUpdate = async (id, status) => {
    const comment = prompt(`Enter comment for ${status} (optional):`);
    try {
      await axios.put(`http://localhost:5000/api/leave/status/${id}`, { status, comment });
      fetchLeaves();
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  return (
    <div className="leave-list-container">
      <h2>All Leave Requests</h2>

      <div className="filter-bar">
        <input type="text" placeholder="Search by name" value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })} />

        <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
          <option>All</option>
          <option>Pending</option>
          <option>Approved</option>
          <option>Rejected</option>
        </select>

        <input type="date" value={filters.from} onChange={(e) => setFilters({ ...filters, from: e.target.value })} />
        <input type="date" value={filters.to} onChange={(e) => setFilters({ ...filters, to: e.target.value })} />

        <select value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value })}>
          <option value="recent">Most Recent</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>

      <LeaveTable leaves={leaves} onUpdateStatus={handleStatusUpdate} />
    </div>
  );
};

const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-GB');

const LeaveTable = ({ leaves, onUpdateStatus }) => (
  <table className="styled-table">
    <thead>
      <tr>
        <th>Employee</th>
        <th>ID</th>
        <th>Type</th>
        <th>From</th>
        <th>To</th>
        <th>Status</th>
        <th>Reason</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {leaves.map(leave => (
        <tr key={leave._id}>
          <td>{leave.name}</td>
          <td>{leave.employeeId}</td>
          <td>{leave.type}</td>
          <td>{formatDate(leave.fromDate)}</td>
          <td>{formatDate(leave.toDate)}</td>
          <td>{leave.status}</td>
          <td>{leave.reason}</td>
          <td>
            {leave.status === 'Pending' && (
              <>
                <button onClick={() => onUpdateStatus(leave._id, 'Approved')}>Approve</button>
                <button onClick={() => onUpdateStatus(leave._id, 'Rejected')}>Reject</button>
              </>
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default LeaveList;
