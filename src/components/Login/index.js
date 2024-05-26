import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../Services/authService';
import './index.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
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
          setError('Invalid username or password');
        }
      })
      .catch(error => {
        // Handle login error
        setError('Login error: ' + error.message);
      });
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          placeholder="Username" 
          required 
        />
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Password" 
          required 
        />
        <button type="submit">Login</button>
      </form>
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default Login;