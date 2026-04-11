import React, { useState, useEffect } from 'react';
import api from '../../api';
import { X } from 'lucide-react';
import { Modal } from '../common/UIComponents';

const labelStyle = { display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem' };
const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: 'var(--radius)', border: '1px solid #ddd', fontSize: '0.95rem', outline: 'none', transition: 'border 0.2s', boxSizing: 'border-box' };

const PREDEFINED_POSITIONS = [
  "President",
  "Vice President",
  "Secretary",
  "Treasurer",
  "Auditor",
  "Public Information Officer (PIO)",
  "Business Manager",
  "Peace Officer",
  "Muse",
  "Escort",
  "Councilor / Representative (1)",
  "Councilor / Representative (2)"
];

export const NewElectionModal = ({ isOpen, onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('draft');
  const [positions, setPositions] = useState([...PREDEFINED_POSITIONS]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/admin/elections', { title, startDate, endDate, status, positions: positions.filter(p => p.trim()).map(p => ({ title: p.trim() })) });
      onSuccess();
    } catch (err) { alert(err.response?.data?.error || 'Failed'); } finally { setSubmitting(false); }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Election">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div><label style={labelStyle}>Election Title *</label><input type="text" value={title} onChange={e => setTitle(e.target.value)} required style={inputStyle} /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div><label style={labelStyle}>Start Date *</label><input type="datetime-local" value={startDate} onChange={e => setStartDate(e.target.value)} required style={inputStyle} /></div>
          <div><label style={labelStyle}>End Date *</label><input type="datetime-local" value={endDate} onChange={e => setEndDate(e.target.value)} required style={inputStyle} /></div>
        </div>
        <div><label style={labelStyle}>Status</label><select value={status} onChange={e => setStatus(e.target.value)} style={inputStyle}><option value="draft">Draft</option><option value="active">Active</option><option value="closed">Closed</option></select></div>
        <div>
          <label style={labelStyle}>Positions</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px', maxHeight: '180px', overflowY: 'auto', background: '#f8f9fa', padding: '12px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }}>
            {PREDEFINED_POSITIONS.map(p => (
              <label key={p} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={positions.includes(p)} 
                  onChange={(e) => {
                    if (e.target.checked) setPositions([...positions, p]);
                    else setPositions(positions.filter(pos => pos !== p));
                  }} 
                />
                {p}
              </label>
            ))}
          </div>
        </div>
        <button type="submit" disabled={submitting} className="btn btn-primary">{submitting ? 'Creating...' : 'Create Election'}</button>
      </form>
    </Modal>
  );
};

export const EditElectionModal = ({ isOpen, onClose, election, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('draft');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { if (election) { setTitle(election.title); setStatus(election.status); } }, [election]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.put(`/admin/elections/${election.id}`, { title, status });
      onSuccess();
    } catch (err) { alert(err.response?.data?.error || 'Failed'); } finally { setSubmitting(false); }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Election">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div><label style={labelStyle}>Title</label><input type="text" value={title} onChange={e => setTitle(e.target.value)} required style={inputStyle} /></div>
        <div><label style={labelStyle}>Status</label><select value={status} onChange={e => setStatus(e.target.value)} style={inputStyle}><option value="draft">Draft</option><option value="active">Active</option><option value="closed">Closed</option></select></div>
        <button type="submit" disabled={submitting} className="btn btn-primary">Save Changes</button>
      </form>
    </Modal>
  );
};
