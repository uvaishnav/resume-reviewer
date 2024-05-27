import React, { useState, useEffect, useCallback } from 'react';
import { getCurrentUser, logout } from '../Services/authService';
import { uploadResume, getFeedback, fetchAlumniDetails } from '../Services/studentService';
import Dropzone from 'react-dropzone';
import { useNavigate } from 'react-router-dom';

import './index.css';

const StudentDashboard = () => {
  const [resume, setResume] = useState([]);
  const [applyingRole, setApplyingRole] = useState('');
  const [feedback, setFeedback] = useState([]);
  const [message, setMessage] = useState('');
  const [fileDropped, setFileDropped] = useState(false);
  const [alumniDetails, setAlumniDetails] = useState(null);
  const [studentName, setStudentName] = useState('');
  const navigate = useNavigate();

  const fetchFeedbackData = useCallback(async (token) => {
    try {
      const feedbackData = await getFeedback(token);
      setFeedback(feedbackData);

      // Check if there is feedback data
      if (feedbackData.length > 0) {
        // If feedback data exists, fetch alumni details
        const alumniId = feedbackData[0].user_id; // Assuming user_id is present in feedback data
        const alumniDetails = await fetchAlumniDetails(alumniId, token);
        // Set alumni details in state
        setAlumniDetails(alumniDetails);
      }
    } catch (error) {
      console.error('Error fetching feedback data:', error);
    }
  }, []);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      // Fetch feedback data when the component mounts
      fetchFeedbackData(user.jwtToken);
      setStudentName(user.name);
    }
  }, [fetchFeedbackData]);

  const handleDrop = (acceptedFiles) => {
    setFileDropped(true);
    setResume(acceptedFiles);
  };

  const handleLogout = () => {
    // Call the logout function from authService
    logout();
    // Redirect the user to the home page
    navigate('/');
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

  return (
    <>
      <div className='student-container'>
        <div className="student-dashboard">
          <h2>Student Dashboard</h2>
          <h1>Hello {studentName},</h1>
          <div className="upload-section">
            <h3>Upload Your Resume</h3>
            <Dropzone onDrop={handleDrop} multiple={false} accept="application/pdf">
              {({ getRootProps, getInputProps }) => (
                <div {...getRootProps({ className: 'dropzone' })}>
                  <input {...getInputProps()} />
                  {fileDropped ? (
                    <div className="upload-indicator">
                      <p>Resume Taken</p>
                      <div className="loader"></div>
                    </div>
                  ) : (
                    <p>
                      Drag and drop your resume here, or click to select a file
                    </p>
                  )}
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
            {message && <p className="message">{message}</p>}
          </div>
        </div>
        <div className="feedback-section alumni-details-section">
          <h3>Feedback</h3>
          {feedback.length > 0 ? (
            <div>
              <ul>
                {feedback.map((item, index) => (
                  <li key={index}>
                    <p><span className="skill-head">Skills To Add:</span> {item.skills}</p>
                    <p><span className="skill-head">Projects Suggestions: </span>{item.projects}</p>
                    <p><span className="skill-head">Feedback: </span>{item.feedback}</p>
                  </li>
                ))}
              </ul>
              {alumniDetails && (
                <div className="alumni-details">
                  <h3>Feedback Given by-</h3>
                  <p className="alumni-info alumni-name">Name: {alumniDetails.name}</p>
                  <p className="alumni-info alumni-email">Email: {alumniDetails.email}</p>
                  <p className="alumni-info alumni-linkedin">
                    LinkedIn: <a href={alumniDetails.linkedin}>{alumniDetails.linkedin}</a>
                  </p>
                  <p className="alumni-info alumni-current-role">Current Role: {alumniDetails.curr_role}</p>
                </div>
              )}
            </div>
          ) : (
            <p>No feedback yet</p>
          )}
        </div>
      </div>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </>
  );
};

export default StudentDashboard;
