import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { UserCheck, Lock, Shield } from 'lucide-react';

export const AdminLogin = () => {
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
      if(res.data.user.role !== 'admin' && res.data.user.role !== 'superadmin') {
         setError('Access denied. Administrator privileges required.');
         return;
      }
      login(res.data);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', width: '100%' }} className="fade-in">
      <div className="card glass" style={{ borderTop: '4px solid var(--primary)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <Shield color="var(--primary)" /> Admin Portal
        </h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem', fontSize: '0.9rem' }}>Authorized Personnel Only</p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Admin ID</label>
            <div style={{ position: 'relative' }}>
               <UserCheck size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
               <input
                 type="text"
                 value={studentId}
                 onChange={(e) => setStudentId(e.target.value)}
                 required
                 placeholder="e.g. admin"
                 style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }}
               />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Password</label>
            <div style={{ position: 'relative' }}>
               <Lock size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
               <input
                 type="password"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 required
                 placeholder="••••••••"
                 style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }}
               />
            </div>
          </div>

          {error && <div style={{ color: 'var(--accent)', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}

          <button type="submit" disabled={loading} className="btn btn-outline" style={{ marginTop: '1rem', background: 'var(--primary)', color: 'white' }}>
            {loading ? 'Authenticating...' : 'Secure Access'}
          </button>
        </form>
      </div>
    </div>
  );
};
