import React, { useState } from 'react';
import { login as apiLogin } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login: loginAction } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Use dummy API for login
      const res = await apiLogin(email, password);
      localStorage.setItem('token', res.token);
      loginAction(email, password); // update redux/auth context
      navigate('/');
    } catch {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-semibold">
          Login
        </button>
      </form>
      <div className="mt-4 flex justify-between">
        <button className="text-blue-600" onClick={() => navigate('/register')}>
          Register
        </button>
        <button className="text-blue-600" onClick={() => navigate('/forgot')}>
          Forgot Password?
        </button>
      </div>
    </div>
  );
};
export default Login;
