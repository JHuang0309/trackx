import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const api = import.meta.env.VITE_API_URL;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await axios.post(`${api}/login`, { email, password });
      setSuccess('Login successful!');
      setEmail(''); setPassword('');
      localStorage.setItem('access_token', res.data.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Login failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input className="w-full px-3 py-2 border rounded" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input className="w-full px-3 py-2 border rounded" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors" type="submit">Login</button>
        </form>
        {error && <div className="text-red-500 text-center">{error}</div>}
        {success && <div className="text-green-600 text-center">{success}</div>}
      </div>
    </div>
  );
}

export default LoginPage;
