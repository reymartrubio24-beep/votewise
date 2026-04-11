import React, { useState } from 'react';
import api from '../../api';
import { Modal } from '../common/UIComponents';

const labelStyle = { display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem' };
const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: 'var(--radius)', border: '1px solid #ddd', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box', marginBottom: '10px' };

export const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await api.put('/admin/password', { currentPassword, newPassword });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setCurrentPassword('');
         setNewPassword('');
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Change Password">
      {success ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#2e7d32', fontWeight: 'bold' }}>
          Password successfully updated!
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && <div style={{ color: '#d32f2f', marginBottom: '1rem', fontSize: '0.9rem', backgroundColor: '#ffebee', padding: '10px', borderRadius: '5px' }}>{error}</div>}
          <div>
            <label style={labelStyle}>Current Password</label>
            <input 
              type="password" 
              value={currentPassword} 
              onChange={e => setCurrentPassword(e.target.value)} 
              required 
              style={inputStyle} 
            />
          </div>
          <div>
            <label style={labelStyle}>New Password</label>
            <input 
              type="password" 
              value={newPassword} 
              onChange={e => setNewPassword(e.target.value)} 
              required 
              style={inputStyle} 
            />
          </div>
          <button type="submit" disabled={submitting} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            {submitting ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      )}
    </Modal>
  );
};
