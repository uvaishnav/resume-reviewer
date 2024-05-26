import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../Services/authService';
import { getResumes, submitFeedback } from '../Services/alumniService';


const AlumniDashboard = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [skills, setskills] = useState('');
  const [projects, setprojects] = useState('');
  const [feedback, setfeedback] = useState('');

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      getResumes(user.jwtToken).then(data => setResumes(data));
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

  return (
    <div>
      <h2>Alumni Dashboard</h2>
      <h3>Resumes</h3>
      <ul>
        {resumes.map((resume) => (
          <li key={resume.id} onClick={() => handleResumeClick(resume)}>
            {resume.username}'s Resume
          </li>
        ))}
      </ul>
      {selectedResume && (
        <div>
          <h3>Review Resume</h3>
          <a href={`../backend/${selectedResume.file_path}`} target="_blank" rel="noopener noreferrer">View Resume</a>
          <textarea value={skills} onChange={(e) => setskills(e.target.value)} placeholder="Suggest Skills to add"></textarea>
          <textarea value={projects} onChange={(e) => setprojects(e.target.value)} placeholder="Suggestion projects to work on"></textarea>
          <textarea value={feedback} onChange={(e) => setfeedback(e.target.value)} placeholder="Overall Feedback"></textarea>
          <button onClick={handleFeedbackSubmit}>Submit Feedback</button>
        </div>
      )}
    </div>
  );
};

export default AlumniDashboard;
