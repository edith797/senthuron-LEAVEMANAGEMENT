import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdminLogin, setIsAdminLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isAdminLogin
      ? '/api/auth/admin-login'
      : '/api/auth/employee-login';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include' // required for session-based auth
      });

      const data = await res.json();

      if (data.success) {
        if (isAdminLogin) {
          localStorage.setItem('admin', true);
          navigate('/admin');
        } else {
          // ✅ Store employeeId for use in dashboard
          localStorage.setItem('employeeId', data.employee._id);
          navigate('/employee');
        }
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Login failed');
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleSubmit}>
        <h2>{isAdminLogin ? 'Admin Login' : 'Employee Login'}</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>

        <p
          onClick={() => setIsAdminLogin(!isAdminLogin)}
          style={{ cursor: 'pointer' }}
        >
          {isAdminLogin ? 'Login as Employee' : 'Login as Admin'}
        </p>
      </form>
    </div>
  );
};

export default Login;
