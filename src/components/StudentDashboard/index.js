import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../Services/authService';
import { uploadResume, getFeedback } from '../Services/studentService';
import Dropzone from 'react-dropzone';

import './index.css';

const StudentDashboard = () => {
  const [resume, setResume] = useState([]);
  const [applyingRole, setApplyingRole] = useState('');
  const [feedback, setFeedback] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      // Fetch feedback data when the component mounts
      fetchFeedbackData(user.jwtToken);
    }
  }, []);

  const handleDrop = (acceptedFiles) => {
    setResume(acceptedFiles);
  };

  const handleResumeUpload = async () => {
    const user = getCurrentUser();
    if (user && resume.length > 0) {
      const formData = new FormData();
      formData.append('resume', resume[0]);
      formData.append('applyingRole', applyingRole);

      try {
        const response = await uploadResume(user.jwtToken, formData);
        setMessage(response);
        // After successful upload, refetch feedback data
        fetchFeedbackData(user.jwtToken);
      } catch (error) {
        setMessage('Error uploading file');
        console.error('Error uploading file:', error);
      }
    } else {
      setMessage('No file selected or user not authenticated');
    }
  };

  const fetchFeedbackData = async (token) => {
    try {
      const feedbackData = await getFeedback(token);
      setFeedback(feedbackData);
    } catch (error) {
      console.error('Error fetching feedback data:', error);
    }
  };

  return (
    <div>
      <h2>Student Dashboard</h2>
      <div>
        <h3>Upload Your Resume</h3>
        <Dropzone onDrop={handleDrop} multiple={false} accept="application/pdf">
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps({ className: 'dropzone' })}>
              <input {...getInputProps()} />
              <p>Drag and drop your resume here, or click to select a file</p>
            </div>
          )}
        </Dropzone>
        <input
          type="text"
          placeholder="Applying Role"
          value={applyingRole}
          onChange={(e) => setApplyingRole(e.target.value)}
        />
        <button onClick={handleResumeUpload}>Upload</button>
        {message && <p>{message}</p>}
      </div>

      <div>
        <h3>Feedback</h3>
        {feedback.length > 0 ? (
          <ul>
            {feedback.map((item, index) => (
              <li key={index}>
                <p>Skills: {item.skills}</p>
                <p>Projects: {item.projects}</p>
                <p>Feedback: {item.feedback}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No feedback yet</p>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
