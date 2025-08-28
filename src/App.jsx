import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/layout/Navbar.jsx';
import Login from './components/auth/Login.jsx';
import Register from './components/auth/Register.jsx';
import Dashboard from './components/dashboard/Dashboard.jsx';
import PrivateRoute from './components/routing/PrivateRoute.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import setAuthToken from './utils/setAuthToken';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  return (
    <AuthProvider>
      <Navbar />
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/dashboard/*" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
           <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </AuthProvider>
  );
};

export default App;