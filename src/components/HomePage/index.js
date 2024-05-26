import React from 'react';
import { Link } from 'react-router-dom';
import './index.css'; // Import CSS file for styling

const HomePage = () => (
  <div className="homepage-container">
    <div className="background-gif"></div> {/* Background GIF */}
    <nav>
      {/* Navigation bar */}
      <Link to="/">Home</Link> {/* Link to your home page */}
      <Link to="/about">About</Link>
      <Link to="/contact">Contact</Link>
      {/* Add additional links here */}
    </nav>
    <nav>
  <img src="/logo.png" alt="Your company logo" className="logo" /> {/* Add logo image */}
  {/* ... other navigation links ... */}
</nav>
    <main className="main-content">
      {/* Left section with description */}
      <div className="left-section">
        <div className="site-description">
          <h1>Resume Reviewer</h1> {/* Moved heading here */}
          <p>
            Your tool for tailoring resumes to job descriptions. Get your
            dream job by creating a resume that perfectly matches the
            requirements of the position you're applying for.
          </p>
          <Link to="/login">Login</Link>
          <Link to="/register">Sign Up</Link>
        </div>
      </div>
      <div className="right-section">
        <img
          src={`${process.env.PUBLIC_URL}/resume.jpeg`} // Correct path to the image in public directory
          alt="Resume Matcher illustration"
        />
      </div>
    </main>
  </div>
);

export default HomePage;