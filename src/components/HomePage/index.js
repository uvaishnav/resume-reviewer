import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => (
  <div>
    <h1>Welcome to the Resume Review System</h1>
    <nav>
      <Link to="/login">Login</Link>
      <Link to="/register">Sign Up</Link>
    </nav>
  </div>
);

export default HomePage;
