import React from 'react';
import { Link } from 'react-router-dom';
import './index.css'; // Import CSS file for styling

const HomePage = () => (
  <div className="homepage-container">
    <main className="main-content">
      {/* Left section with description */}
      <div className="left-section">
        <h1>Resume Reviewer</h1>
        <h2>Get Insights from Alumni</h2>
        <p>
          Connect with industry experts who were once in your shoes. Get valuable
          suggestions and advice from alumni to help you navigate your career path
          and achieve your professional goals.
        </p>
        <div className="buttons">
          <Link to="/login" className="btn">Login</Link>
          <Link to="/register" className="btn">Sign Up</Link>
        </div>
      </div>
      <div className="right-section">
        <img
          src={`${process.env.PUBLIC_URL}/resume.jpeg`} // Correct path to the image in public directory
          alt="Networking illustration"
        />
      </div>
    </main>
  </div>
);

export default HomePage;
