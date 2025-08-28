import React, { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  user: null,
  error: null,
};

export const AuthContext = createContext(initialState);

const authReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'USER_LOADED':
      return { ...state, isAuthenticated: true, loading: false, user: payload, error: null };
    
    case 'REGISTER_SUCCESS':
    case 'LOGIN_SUCCESS': {
      const token = payload.token || payload.jwt;
      if (token) {
        localStorage.setItem('token', token);
        setAuthToken(token);
      }
      return { ...state, token, isAuthenticated: true, loading: false, error: null };
    }
    
    case 'AUTH_ERROR':
      return { ...state, isAuthenticated: false, loading: false, error: payload };
    
    case 'LOGIN_FAIL':
    case 'REGISTER_FAIL':
      return { ...state, isAuthenticated: false, loading: false, error: payload };
    
    case 'LOGOUT':
      localStorage.removeItem('token');
      setAuthToken(null);
      return { ...state, token: null, isAuthenticated: false, loading: false, user: null, error: null };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    case 'SET_LOADING':
      return { ...state, loading: payload };
    
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user only if token exists
  const loadUser = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      dispatch({ type: 'SET_LOADING', payload: false });
      return;
    }
    
    setAuthToken(token);
    try {
      const res = await axios.get('https://image-management-backend-green.vercel.app/api/auth');
      dispatch({ type: 'USER_LOADED', payload: res.data });
      console.log('User loaded successfully:', res.data);
    } catch (err) {
      console.error('Failed to load user:', err);
      dispatch({ type: 'AUTH_ERROR', payload: err.response?.data?.msg || 'Authentication failed' });
      localStorage.removeItem('token');
      setAuthToken(null);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const register = async (formData) => {
    try {
      dispatch({ type: 'CLEAR_ERROR' });
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const res = await axios.post('https://image-management-backend-green.vercel.app/api/auth/register', formData);
      
      dispatch({ type: 'REGISTER_SUCCESS', payload: res.data });
      await loadUser();
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.msg || 'Registration failed';
      dispatch({ type: 'REGISTER_FAIL', payload: errorMsg });
      dispatch({ type: 'SET_LOADING', payload: false });
      return { success: false, error: errorMsg };
    }
  };

  const login = async (formData) => {
    try {
      dispatch({ type: 'CLEAR_ERROR' });
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const res = await axios.post('https://image-management-backend-green.vercel.app/api/auth/login', formData);
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
      await loadUser();
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.msg || 'Login failed';
      dispatch({ type: 'LOGIN_FAIL', payload: errorMsg });
      dispatch({ type: 'SET_LOADING', payload: false });
      return { success: false, error: errorMsg };
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider value={{ 
      ...state, 
      register, 
      login, 
      logout, 
      loadUser,
      clearError 
    }}>
      {children}
    </AuthContext.Provider>
  );
};