import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Trash2 } from 'lucide-react';

export const VoterListPanel = () => {
  const [voters, setVoters] = useState([]);
  const [showAll, setShowAll] = useState(false);
  
  const fetchVoters = () => api.get('/admin/voters').then(res => setVoters(res.data)).catch(() => setVoters([]));
  useEffect(() => { fetchVoters(); }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete registered voter "${name}"?`)) return;
    try {
      await api.delete(`/admin/voters/${id}`);
      fetchVoters();
    } catch (err) { alert('Failed to delete voter'); }
  };

  const displayed = showAll ? voters : voters.slice(0, 20);
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><h3>Registered Voters</h3>{showAll && <button onClick={() => setShowAll(false)} style={{ background: 'none', border: 'none', color: 'var(--secondary)', cursor: 'pointer', fontSize: '0.8rem' }}>Collapse</button>}</div>
      <div style={{ marginTop: '1rem', maxHeight: '350px', overflowY: 'auto' }}>
        {displayed.map(v => (
          <div key={v.id} style={{ fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between', padding: '8px', borderBottom: '1px solid #f0f0f0', alignItems: 'center' }}>
            <div><span style={{ fontWeight: 600 }}>{v.name}</span><span style={{ color: '#888', marginLeft: '10px' }}>{v.studentId}</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ background: v.participation.length > 0 ? '#e8f5e9' : '#fff3e0', color: v.participation.length > 0 ? '#2e7d32' : '#e65100', padding: '2px 10px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 600 }}>{v.participation.length > 0 ? `Voted` : 'Not Voted'}</span>
              <button onClick={() => handleDelete(v.id, v.name)} style={{ background: 'none', border: 'none', color: '#d32f2f', cursor: 'pointer', display: 'flex' }}><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        {!showAll && voters.length > 20 && <button onClick={() => setShowAll(true)} style={{ width: '100%', background: '#f8f9fa', border: '1px dashed #ccc', borderRadius: 'var(--radius)', cursor: 'pointer', textAlign: 'center', color: '#666', marginTop: '12px', padding: '10px', fontWeight: 600 }}>See remaining {voters.length - 20} voters...</button>}
      </div>
    </div>
  );
};
