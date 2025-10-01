import React, { useState } from 'react';
import { register as apiRegister } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthContext';

const Register: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', mobile: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register: registerAction } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRegister({
        ...form,
        email: form.email,
        password: form.password,
        name: form.name,
        mobile: form.mobile,
      });
      registerAction(form.name, form.email, form.password); // update redux/auth context
      navigate('/login');
    } catch {
      setError('Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full mb-3 p-2 border rounded"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full mb-3 p-2 border rounded"
        />
        <input
          name="mobile"
          placeholder="Mobile"
          value={form.mobile}
          onChange={(e) => setForm({ ...form, mobile: e.target.value })}
          className="w-full mb-3 p-2 border rounded"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full mb-3 p-2 border rounded"
        />
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-semibold">
          Register
        </button>
      </form>
      <button className="mt-4 text-blue-600" onClick={() => navigate('/login')}>
        Already have an account?
      </button>
    </div>
  );
};
export default Register;
