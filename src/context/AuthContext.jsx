import React, { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null,
  error: null,
};

export const AuthContext = createContext(initialState);

const authReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'USER_LOADED':
      return { ...state, isAuthenticated: true, loading: false, user: payload };
    case 'REGISTER_SUCCESS':
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', payload.token);
      return { ...state, ...payload, isAuthenticated: true, loading: false, error: null };
    case 'AUTH_ERROR':
    case 'LOGIN_FAIL':
    case 'REGISTER_FAIL':
    case 'LOGOUT':
      localStorage.removeItem('token');
      return { ...state, token: null, isAuthenticated: false, loading: false, user: null, error: payload };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const loadUser = async () => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
    try {
      const res = await axios.get('https://image-management-backend-green.vercel.app/api/auth');
      dispatch({ type: 'USER_LOADED', payload: res.data });
    } catch (err) {
      dispatch({ type: 'AUTH_ERROR' });
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const register = async (formData) => {
    try {
      const res = await axios.post('https://image-management-backend-green.vercel.app/api/auth/register', formData);
      dispatch({ type: 'REGISTER_SUCCESS', payload: res.data });
      loadUser();
    } catch (err) {
      dispatch({ type: 'REGISTER_FAIL', payload: err.response.data.msg });
    }
  };

  const login = async (formData) => {
    try {
      const res = await axios.post('https://image-management-backend-green.vercel.app/api/auth/login', formData);
      dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
      loadUser();
    } catch (err) {
      dispatch({ type: 'LOGIN_FAIL', payload: err.response.data.msg });
    }
  };

  const logout = () => dispatch({ type: 'LOGOUT' });

  return (
    <AuthContext.Provider value={{ ...state, register, login, logout, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};

