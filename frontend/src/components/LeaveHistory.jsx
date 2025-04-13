import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LeaveHistory = () => {
  const [history, setHistory] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc');

  const fetchHistory = () => {
    axios.get('http://localhost:5000/api/leave/my-leaves', {
      withCredentials: true
    })
      .then(res => {
        const sorted = res.data.sort((a, b) => {
          return sortOrder === 'desc'
            ? new Date(b.createdAt) - new Date(a.createdAt)
            : new Date(a.createdAt) - new Date(b.createdAt);
        });
        setHistory(sorted);
      })
      .catch(err => console.error('Error fetching leave history:', err));
  };

  useEffect(() => {
    fetchHistory();
  }, [sortOrder]);

  return (
    <div className="leave-history-container">
      <h2>Leave History</h2>
      <div className="sort-control">
        <label>Sort by: </label>
        <select onChange={e => setSortOrder(e.target.value)} value={sortOrder}>
          <option value="desc">Most Recent</option>
          <option value="asc">Oldest</option>
        </select>
      </div>
      <table className="styled-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>From</th>
            <th>To</th>
            <th>Reason</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {history.map(item => (
            <tr key={item._id}>
              <td>{item.type}</td>
              <td>{new Date(item.fromDate).toLocaleDateString()}</td>
              <td>{new Date(item.toDate).toLocaleDateString()}</td>
              <td>{item.reason}</td>
              <td className={`status ${item.status.toLowerCase()}`}>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveHistory;
