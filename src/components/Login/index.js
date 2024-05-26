import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../Services/authService';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(username, password)
      .then(data => {
        if (data.jwtToken) {
          if (data.role === 'student') {
            navigate('/student-dashboard');
          } else if (data.role === 'alumni') {
            navigate('/alumni-dashboard');
          }
        } else {
          // Handle invalid login scenario
          console.error('Invalid login');
        }
      })
      .catch(error => {
        // Handle login error
        console.error('Login error:', error);
      });
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
