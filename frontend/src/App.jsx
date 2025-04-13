// App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import AdminDashboard from './components/AdminDashboard';
import EmployeeList from './components/EmployeeList';
import NewEmployee from './components/NewEmployee';
import LeaveList from './components/LeaveList';
import LeavePending from './components/LeavePending';
import LeaveApproved from './components/LeaveApproved';
import LeaveRejected from './components/LeaveRejected';
import EmployeeDashboard from './components/EmployeeDashboard';
import ApplyLeave from './components/ApplyLeave';
import LeaveHistory from './components/LeaveHistory';
import './index.css'; // Your custom styling
import './components/Sidebar.css'; // Sidebar styling
import './components/Login.css'; // Login styling

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin" element={<Sidebar />}>
        <Route index element={<AdminDashboard />} />
        <Route path="employees" element={<EmployeeList />} />
        <Route path="employees/new" element={<NewEmployee />} />
        <Route path="leaves" element={<LeaveList />} />
        <Route path="leaves/pending" element={<LeavePending />} />
        <Route path="leaves/approved" element={<LeaveApproved />} />
        <Route path="leaves/rejected" element={<LeaveRejected />} />
      </Route>

      <Route path="/employee" element={<Sidebar />}>
        <Route index element={<EmployeeDashboard />} />
        <Route path="apply" element={<ApplyLeave />} />
        <Route path="history" element={<LeaveHistory />} />
      </Route>
    </Routes>
  );
}

export default App;
