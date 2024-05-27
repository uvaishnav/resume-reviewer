import React, { useState, useEffect } from 'react';
import { getCurrentUser ,logout} from '../Services/authService';
import { getResumes, submitFeedback } from '../Services/alumniService';
import { useNavigate } from 'react-router-dom';
import './index.css';

const AlumniDashboard = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [skills, setSkills] = useState('');
  const [projects, setProjects] = useState('');
  const [feedback, setFeedback] = useState('');
  const [alumniName, setAlumniName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      getResumes(user.jwtToken).then(data => setResumes(data));
      setAlumniName(user.name); // Set alumni name when the component mounts
    }
  }, []);

  const handleResumeClick = (resume) => {
    setSelectedResume(resume);
  };

  const handleFeedbackSubmit = async () => {
    const user = getCurrentUser();
    if (user && selectedResume) {
      const feedbackData = {
        resumeId: selectedResume.id,
        skills,
        projects,
        feedback
      };
      const response = await submitFeedback(user.jwtToken, feedbackData);
      alert(response.message);
    }
  };

  const handleLogout = () => {
    // Call the logout function from authService
    logout();
    // Redirect the user to the home page
    navigate('/');
  };

  return (
    <>
    <div className="alumni-dashboard">
      <h2 className="dashboard-title">Alumni Dashboard</h2>
      <h1>Hello {alumniName},</h1> {/* Display alumni name */}
      <h3 className="section-title">Choose a Resume to Review</h3>
      <ul className="resume-list">
        {resumes.map((resume) => (
          <li key={resume.id} onClick={() => handleResumeClick(resume)} className="resume-item">
            {resume.username}'s Resume
          </li>
        ))}
      </ul>
      {selectedResume && (
        <div className="resume-review-section">
          <h3 className="section-title">Review Resume</h3>
          <a 
            href={`${process.env.REACT_APP_API_URL}/${selectedResume.file_path}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="view-resume-link"
          >
            View Resume
          </a>       
          <textarea value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="Suggest Skills to add" className="feedback-input"></textarea>
          <textarea value={projects} onChange={(e) => setProjects(e.target.value)} placeholder="Suggestion projects to work on" className="feedback-input"></textarea>
          <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Overall Feedback" className="feedback-input"></textarea>
          <button onClick={handleFeedbackSubmit} className="submit-button">Submit Feedback</button>
        </div>
      )}
    </div>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </>
  );
};

export default AlumniDashboard;
