import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Search } from 'lucide-react';

export const VoterListPanel = () => {
  const [voters, setVoters] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const fetchVoters = () => api.get('/admin/voters').then(res => setVoters(res.data)).catch(() => setVoters([]));
  useEffect(() => { fetchVoters(); }, []);

  const filteredVoters = voters.filter(v => 
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    v.studentId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayed = showAll ? filteredVoters : filteredVoters.slice(0, 20);
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><h3>Registered Voters</h3>{showAll && <button onClick={() => setShowAll(false)} style={{ background: 'none', border: 'none', color: 'var(--secondary)', cursor: 'pointer', fontSize: '0.8rem' }}>Collapse</button>}</div>
      
      <div style={{ position: 'relative', marginTop: '1rem' }}>
        <input 
          type="text" 
          placeholder="Search by name or student ID..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '100%', padding: '10px 10px 10px 35px', borderRadius: 'var(--radius)', border: '1px solid #ddd', fontSize: '0.9rem' }}
        />
        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
      </div>

      <div style={{ marginTop: '1rem', maxHeight: '400px', overflowY: 'auto' }}>
        {filteredVoters.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#999', padding: '1.5rem' }}>No records found.</p>
        ) : (
          displayed.map(v => (
            <div key={v.id} style={{ fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between', padding: '10px 8px', borderBottom: '1px solid #f0f0f0', alignItems: 'center' }}>
              <div><span style={{ fontWeight: 600 }}>{v.name}</span><span style={{ color: '#888', marginLeft: '10px' }}>{v.studentId}</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ background: v.participation.length > 0 ? '#e8f5e9' : '#fff3e0', color: v.participation.length > 0 ? '#2e7d32' : '#e65100', padding: '2px 10px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 600 }}>{v.participation.length > 0 ? `Voted` : 'Not Voted'}</span>
              </div>
            </div>
          ))
        )}
        {!showAll && filteredVoters.length > 20 && <button onClick={() => setShowAll(true)} style={{ width: '100%', background: '#f8f9fa', border: '1px dashed #ccc', borderRadius: 'var(--radius)', cursor: 'pointer', textAlign: 'center', color: '#666', marginTop: '12px', padding: '10px', fontWeight: 600 }}>See remaining {filteredVoters.length - 20} voters...</button>}
      </div>
    </div>
  );
};
