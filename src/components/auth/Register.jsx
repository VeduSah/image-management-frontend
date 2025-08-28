import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';

const Register = () => {
    const { register, isAuthenticated, error } = useContext(AuthContext);
    const navigate = useNavigate();
    const [user, setUser] = useState({ username: '', password: '', password2: '' });
    const { username, password, password2 } = user;
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
        if(error) {
            setAlert(error);
            setTimeout(() => setAlert(null), 5000);
        }
    }, [isAuthenticated, error, navigate]);

    const onChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

    const onSubmit = (e) => {
        e.preventDefault();
        if (password !== password2) {
            setAlert('Passwords do not match');
            setTimeout(() => setAlert(null), 5000);
        } else {
            register({ username, password });
        }
    };

    return (
        <div className="flex items-center justify-center mt-20">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
                <h1 className="text-2xl font-bold text-center mb-6">Account Register</h1>
                {alert && <p className="text-red-500 text-center mb-4">{alert}</p>}
                <form onSubmit={onSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">Username</label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" type="text" name="username" value={username} onChange={onChange} required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" type="password" name="password" value={password} onChange={onChange} required minLength="6" />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password2">Confirm Password</label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" type="password" name="password2" value={password2} onChange={onChange} required minLength="6" />
                    </div>
                    <div className="flex items-center justify-between">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full" type="submit">
                            Register
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
