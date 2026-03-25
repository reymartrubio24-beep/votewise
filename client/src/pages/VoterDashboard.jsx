import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Calendar, CheckCircle, ChevronRight, AlertCircle } from 'lucide-react';

export const VoterDashboard = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const res = await api.get('/elections');
        setElections(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchElections();
  }, []);

  if (loading) return <div>Loading elections...</div>;

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1>Welcome, {user.name}!</h1>
        <p style={{ color: '#666' }}>ID: {user.studentId} | Academic Year 2025-2026</p>
      </div>

      <div className="card" style={{ marginBottom: '3rem', background: 'var(--primary-light)', color: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <AlertCircle size={32} color="var(--accent)" />
          <div>
            <h3 style={{ color: 'white', margin: 0 }}>Active Elections</h3>
            <p style={{ margin: 0, opacity: 0.8 }}>Please complete your ballot before the deadline.</p>
          </div>
        </div>
      </div>

      {elections.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <Calendar size={48} color="#ccc" style={{ marginBottom: '1rem' }} />
          <h3>No Active Elections</h3>
          <p>Check back later or contact the election committee.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {elections.map((election) => (
            <div key={election.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div>
                  <h2 style={{ marginBottom: '5px' }}>{election.title}</h2>
                  <p style={{ fontSize: '0.9rem', color: '#666' }}>Ends: {new Date(election.endDate).toLocaleString()}</p>
                </div>
                <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '5px 15px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>
                  ACTIVE
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                {election.positions.map((pos) => {
                  const hasVoted = pos.participation && pos.participation.length > 0;
                  return (
                    <div key={pos.id} style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius)',
                      border: '1px solid #eee',
                      background: hasVoted ? '#e8f5e9' : '#f8f9fa',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: 0, fontSize: '0.95rem' }}>{pos.title}</h4>
                        <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#666' }}>
                          {pos.candidates.length} Candidates
                        </p>
                      </div>
                      {hasVoted ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#2e7d32', fontSize: '0.85rem', fontWeight: 600 }}>
                          <CheckCircle size={16} /> Voted
                        </div>
                      ) : (
                         <div style={{ color: '#e65100', fontSize: '0.85rem', fontWeight: 600 }}>
                           Pending
                         </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Action Button for the whole election */}
              <div style={{ textAlign: 'right', borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
                {(() => {
                  const totalPositions = election.positions.length;
                  const votedCount = election.positions.filter(p => p.participation && p.participation.length > 0).length;
                  
                  if (votedCount === totalPositions && totalPositions > 0) {
                    return (
                      <button className="btn" disabled style={{ background: '#2e7d32', color: 'white', opacity: 1, padding: '10px 24px' }}>
                        <CheckCircle size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
                        Ballot Completed
                      </button>
                    );
                  } else {
                    return (
                      <button 
                        onClick={() => navigate(`/vote/${election.id}`)}
                        className="btn btn-primary" 
                        style={{ padding: '12px 30px', fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                      >
                       {votedCount > 0 ? 'Resume Voting' : 'Start Voting'} <ChevronRight size={18} />
                      </button>
                    );
                  }
                })()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
