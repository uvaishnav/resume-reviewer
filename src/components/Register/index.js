import React, { useState } from 'react';
import { register } from '../Services/authService';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [currYear, setCurrYear] = useState('');
  const [branch, setBranch] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [currRole, setCurrRole] = useState('');
  const [suggestRoles, setSuggestRoles] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const studentData = {
      username, password, name, role, email, cgpa, curr_year: currYear, branch,
    };

    const alumniData = {
      username, password, name, role, email, linkedin, curr_role: currRole, suggest_roles: suggestRoles,
    };

    const data = role === 'student' ? studentData : alumniData;

    register(data)
      .then(response => {
        setMessage(response);
        alert(response);
      })
      .catch(error => {
        setMessage(error);
        alert(error);
      });
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <div>
          <input type="radio" id="student" name="role" value="student" checked={role === 'student'} onChange={() => setRole('student')} />
          <label htmlFor="student">Register as Student</label>
          <input type="radio" id="alumni" name="role" value="alumni" checked={role === 'alumni'} onChange={() => setRole('alumni')} />
          <label htmlFor="alumni">Register as Alumni</label>
        </div>
        {role === 'student' && (
          <>
            <input type="text" value={cgpa} onChange={(e) => setCgpa(e.target.value)} placeholder="CGPA" required />
            <input type="text" value={currYear} onChange={(e) => setCurrYear(e.target.value)} placeholder="Current Year" required />
            <input type="text" value={branch} onChange={(e) => setBranch(e.target.value)} placeholder="Branch" required />
          </>
        )}
        {role === 'alumni' && (
          <>
            <input type="text" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="LinkedIn Profile" required />
            <input type="text" value={currRole} onChange={(e) => setCurrRole(e.target.value)} placeholder="Current Role" required />
            <input type="text" value={suggestRoles} onChange={(e) => setSuggestRoles(e.target.value)} placeholder="Suggested Roles" required />
          </>
        )}
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Register;
