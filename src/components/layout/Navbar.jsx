import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  const authLinks = (
    <>
      <li className="mr-4">Hello, {user && user.username}</li>
      <li>
        <a onClick={onLogout} href="#!" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Logout
        </a>
      </li>
    </>
  );

  const guestLinks = (
    <>
      <li className="mr-4">
        <Link to="/login" className="hover:text-gray-300">Login</Link>
      </li>
      <li>
        <Link to="/register" className="hover:text-gray-300">Register</Link>
      </li>
    </>
  );

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">
          <Link to={isAuthenticated ? "/dashboard" : "/"}>ImageDrive</Link>
        </h1>
        <ul className="flex items-center">
          {isAuthenticated ? authLinks : guestLinks}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
