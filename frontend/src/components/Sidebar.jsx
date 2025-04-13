import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaUsers,
  FaPlus,
  FaClipboardList,
  FaClock,
  FaCheck,
  FaTimes,
  FaSignOutAlt,
  FaAngleDown,
  FaAngleUp
} from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = location.pathname.startsWith('/admin');

  const [showEmployeeMenu, setShowEmployeeMenu] = useState(false);
  const [showLeaveMenu, setShowLeaveMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('employeeId');
    navigate('/');
  };

  return (
    <div className="main-layout">
      <div className="sidebar">
        <h2 className="sidebar-title">SENTHURON</h2>
        <nav>
          <ul className="sidebar-menu">
            <li>
              <NavLink to={isAdmin ? '/admin' : '/employee'} className="nav-link">
                <FaTachometerAlt className="nav-icon" /> Dashboard
              </NavLink>
            </li>

            {isAdmin && (
              <>
                <li onClick={() => setShowEmployeeMenu(!showEmployeeMenu)} className="menu-toggle">
                  <FaUsers className="nav-icon" />
                  Employee
                  {showEmployeeMenu ? <FaAngleUp className="dropdown-icon" /> : <FaAngleDown className="dropdown-icon" />}
                </li>
                {showEmployeeMenu && (
                  <ul className="submenu">
                    <li><NavLink to="/admin/employees" className="nav-link"><FaUsers className="sub-icon" /> Employee List</NavLink></li>
                    <li><NavLink to="/admin/employees/new" className="nav-link"><FaPlus className="sub-icon" /> New Employee</NavLink></li>
                  </ul>
                )}

                <li onClick={() => setShowLeaveMenu(!showLeaveMenu)} className="menu-toggle">
                  <FaClipboardList className="nav-icon" />
                  Leave
                  {showLeaveMenu ? <FaAngleUp className="dropdown-icon" /> : <FaAngleDown className="dropdown-icon" />}
                </li>
                {showLeaveMenu && (
                  <ul className="submenu">
                    <li><NavLink to="/admin/leaves" className="nav-link"><FaClipboardList className="sub-icon" /> Leave List</NavLink></li>
                    <li><NavLink to="/admin/leaves/pending" className="nav-link"><FaClock className="sub-icon" /> Pending</NavLink></li>
                    <li><NavLink to="/admin/leaves/approved" className="nav-link"><FaCheck className="sub-icon" /> Approved</NavLink></li>
                    <li><NavLink to="/admin/leaves/rejected" className="nav-link"><FaTimes className="sub-icon" /> Rejected</NavLink></li>
                  </ul>
                )}
              </>
            )}

            {!isAdmin && (
              <>
                <li><NavLink to="/employee/apply" className="nav-link"><FaClipboardList className="nav-icon" /> Apply Leave</NavLink></li>
                <li><NavLink to="/employee/history" className="nav-link"><FaClipboardList className="nav-icon" /> Leave History</NavLink></li>
              </>
            )}

            <li>
              <button onClick={handleLogout} className="logout-btn">
                <FaSignOutAlt className="nav-icon" /> Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Sidebar;
