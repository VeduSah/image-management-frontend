import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import Spinner from '../layout/Spinner.jsx';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return <Spinner />;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;