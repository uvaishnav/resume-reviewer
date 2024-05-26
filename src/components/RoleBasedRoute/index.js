import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '../Services/authService';

const RoleBasedRoute = ({ children, roles }) => {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default RoleBasedRoute;
