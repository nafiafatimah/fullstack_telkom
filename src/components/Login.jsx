import { useState } from 'react';
import api from '../api/axios';

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('user');
  const [password, setPassword] = useState('pass');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('🔑 Mencoba login dengan:', { username, password });
      
      // Gunakan relative URL (tanpa http://localhost:8080)
      const response = await api.post('/api/login', { 
        username, 
        password 
      });
      
      console.log('✅ Response login:', response.data);
      
      const token = response.data.token;
      if (token) {
        console.log('✅ Token diterima!');
        localStorage.setItem('jwt_token', token);
        localStorage.setItem('user', JSON.stringify({ username }));
        onLoginSuccess();
      } else {
        setError('Token tidak ditemukan dalam response');
      }
    } catch (err) {
      console.error('❌ Error login:', err);
      
      if (err.code === 'ERR_NETWORK') {
        setError('❌ Backend tidak dapat diakses! Pastikan Docker berjalan di port 8080');
      } else if (err.response?.status === 401) {
        setError('❌ Username atau password salah! Gunakan: user / pass');
      } else if (err.response?.status === 404) {
        setError('❌ Endpoint /api/login tidak ditemukan');
      } else if (err.response?.status === 429) {
        setError('❌ Terlalu banyak percobaan! Tunggu sebentar.');
      } else {
        setError(err.response?.data?.message || err.response?.data?.error || 'Login gagal!');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="p-8 bg-white rounded-lg shadow-md w-96">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">Login</h2>
        
        {error && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-100 rounded-lg whitespace-pre-wrap">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="username-input" className="block mb-2 text-sm font-medium text-gray-600">
            Username
          </label>
          <input
            id="username-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Masukkan username"
            required
            disabled={loading}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password-input" className="block mb-2 text-sm font-medium text-gray-600">
            Password
          </label>
          <input
            id="password-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Masukkan password"
            required
            disabled={loading}
          />
        </div>

        <button 
          type="submit" 
          className="w-full py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Login'}
        </button>

        <div className="mt-4 text-sm text-center text-gray-500">
          Gunakan username: <strong>user</strong> dan password: <strong>pass</strong>
        </div>
      </form>
    </div>
  );
}