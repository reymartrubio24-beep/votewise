import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { UserCheck, Lock } from 'lucide-react';

export const VoterLogin = () => {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/login', { studentId, password });
      login(res.data);
      if(res.data.user.role === 'admin') navigate('/admin');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', width: '100%' }} className="fade-in">
      <div className="card glass">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Student Login</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Student Lastname</label>
            <div style={{ position: 'relative' }}>
               <UserCheck size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
               <input
                 type="text"
                 value={studentId}
                 onChange={(e) => setStudentId(e.target.value)}
                 required
                 placeholder="e.g. Smith"
                 style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }}
               />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Student ID (Password)</label>
            <div style={{ position: 'relative' }}>
               <Lock size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
               <input
                 type="password"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 required
                 placeholder="e.g. 20230001"
                 style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }}
               />
            </div>
          </div>

          {error && <div style={{ color: 'var(--accent)', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: '1rem' }}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
          <a href="#" style={{ color: 'var(--secondary)', textDecoration: 'none' }}>Forgot password?</a>
        </p>
      </div>
    </div>
  );
};
