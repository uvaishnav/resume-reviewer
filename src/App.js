import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import StudentDashboard from './components/StudentDashboard';
import AlumniDashboard from './components/AlumniDashboard';
import Login from './components/Login';
import Register from './components/Register';
import RoleBasedRoute from './components/RoleBasedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/student-dashboard" element={
          <RoleBasedRoute roles={['student']}>
            <StudentDashboard />
          </RoleBasedRoute>
        } />
        <Route path="/alumni-dashboard" element={
          <RoleBasedRoute roles={['alumni']}>
            <AlumniDashboard />
          </RoleBasedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
