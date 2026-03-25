import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import api, { getImageUrl } from '../api';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, User, ShieldCheck, Info } from 'lucide-react';

export const VotingPage = () => {
  const { id } = useParams(); // Now this is electionId
  const [election, setElection] = useState(null);
  
  // Map of positionId -> candidateId
  const [selections, setSelections] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchElection = async () => {
      try {
        const res = await api.get('/elections');
        const found = res.data.find(e => e.id === parseInt(id));
        setElection(found);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchElection();
  }, [id]);

  const handleSelect = (positionId, candidateId) => {
    setSelections(prev => ({
      ...prev,
      [positionId]: candidateId
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Create an array of vote promises
      const votePromises = Object.entries(selections).map(([posId, candId]) => 
        api.post('/votes', {
          positionId: parseInt(posId),
          candidateId: candId ? parseInt(candId) : null
        })
      );
      
      await Promise.all(votePromises);
      navigate('/confirmation');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit some or all of your votes.');
    } finally {
      setSubmitting(false);
      setShowModal(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading ballot...</div>;
  if (!election) return <div style={{ textAlign: 'center', padding: '4rem' }}>Election not found or not active.</div>;

  // Filter out positions the user has already voted for
  const pendingPositions = election.positions.filter(p => !p.participation || p.participation.length === 0);
  
  const isBallotComplete = pendingPositions.length > 0 && Object.keys(selections).length === pendingPositions.length;

  return (
    <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <button onClick={() => navigate('/dashboard')} className="btn btn-outline" style={{ marginBottom: '2rem', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Official Ballot</h1>
        <h2 style={{ color: 'var(--secondary)', fontWeight: 600 }}>{election.title}</h2>
        <p style={{ color: '#666', marginTop: '1rem' }}>
          Please select your preferred candidates for each position below.
          Once finished, submit your complete ballot at the bottom of the page.
        </p>
      </div>

      {pendingPositions.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
          <ShieldCheck size={64} color="#2e7d32" style={{ margin: '0 auto 1.5rem' }} />
          <h3>Ballot Fully Completed</h3>
          <p style={{ color: '#666' }}>You have already submitted your votes for all positions in this election.</p>
          <button onClick={() => navigate('/dashboard')} className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Return to Dashboard
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {pendingPositions.map((pos, index) => (
            <div key={pos.id} className="card" style={{ border: '1px solid #e0e0e0', borderTop: '4px solid var(--accent)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #f0f0f0', paddingBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: 0, color: 'var(--secondary)' }}>{pos.title}</h3>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#888' }}>Position {index + 1} of {pendingPositions.length}</p>
                </div>
                {selections[pos.id] && (
                   <span style={{ background: '#e8f5e9', color: '#2e7d32', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
                     Selected
                   </span>
                )}
              </div>

              {pos.candidates.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#888', background: '#f9f9f9', borderRadius: 'var(--radius)' }}>
                  <Info size={24} style={{ marginBottom: '0.5rem' }} />
                  <p style={{ margin: 0 }}>No candidates running for this position.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                  {pos.candidates.map((candidate) => {
                    const isSelected = selections[pos.id] === candidate.id;
                    return (
                      <div 
                        key={candidate.id} 
                        onClick={() => handleSelect(pos.id, candidate.id)}
                        style={{
                          cursor: 'pointer',
                          borderRadius: '8px',
                          border: isSelected ? '2px solid var(--accent)' : '2px solid #f0f0f0',
                          background: isSelected ? '#fffdfefa' : 'white',
                          padding: '1.25rem',
                          position: 'relative',
                          transition: 'all 0.2s',
                          boxShadow: isSelected ? '0 4px 12px rgba(233, 69, 96, 0.15)' : 'none'
                        }}
                      >
                        {isSelected && (
                           <div style={{
                             position: 'absolute',
                             top: '10px',
                             right: '10px',
                             background: 'var(--accent)',
                             color: 'white',
                             width: '24px',
                             height: '24px',
                             borderRadius: '50%',
                             display: 'flex',
                             alignItems: 'center',
                             justifyContent: 'center'
                           }}>
                             <ShieldCheck size={14} />
                           </div>
                        )}

                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                          <div style={{
                            width: '50px',
                            height: '50px',
                            background: isSelected ? 'rgba(233, 69, 96, 0.1)' : '#f0f0f0',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: isSelected ? 'var(--accent)' : '#666',
                            flexShrink: 0,
                            overflow: 'hidden'
                          }}>
                            {candidate.photoUrl ? (
                              <img src={getImageUrl(candidate.photoUrl)} alt={candidate.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <User size={24} />
                            )}
                          </div>
                          <div>
                            <h4 style={{ margin: 0, fontSize: '1.05rem', color: isSelected ? 'var(--secondary)' : '#333' }}>{candidate.name}</h4>
                            <p style={{ margin: '2px 0 0', fontWeight: 600, fontSize: '0.8rem', color: isSelected ? 'var(--accent)' : '#888' }}>
                              {candidate.party || 'Independent'}
                            </p>
                          </div>
                        </div>
                        {candidate.platform && (
                          <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#666', lineHeight: 1.4, borderTop: '1px solid #f0f0f0', paddingTop: '0.75rem' }}>
                            "{candidate.platform}"
                          </p>
                        )}
                      </div>
                    );
                  })}

                  {/* Abstain Option */}
                  <div 
                    onClick={() => handleSelect(pos.id, null)}
                    style={{
                      cursor: 'pointer',
                      borderRadius: '8px',
                      border: selections[pos.id] === null ? '2px solid #666' : '2px solid #f0f0f0',
                      background: selections[pos.id] === null ? '#f8f9fa' : 'white',
                      padding: '1.25rem',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      transition: 'all 0.2s',
                    }}
                  >
                    {selections[pos.id] === null && (
                       <div style={{ position: 'absolute', top: '10px', right: '10px', color: '#666' }}>
                         <ShieldCheck size={18} />
                       </div>
                    )}
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '50%', background: '#eee', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666'
                    }}>
                      <Info size={20} />
                    </div>
                    <div>
                      <h4 style={{ margin: 0, color: '#555' }}>Abstain</h4>
                      <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#888' }}>Skip voting for this position</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          <div className="card" style={{ 
            marginTop: '2rem', 
            textAlign: 'center',
            background: 'white',
            border: '2px dashed var(--accent)'
          }}>
            <h3 style={{ marginBottom: '1rem' }}>Ready to Cast Your Vote?</h3>
            <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              {Object.keys(selections).length} of {pendingPositions.length} positions selected.
              {!isBallotComplete && ' You must select a candidate for every position before submitting.'}
            </p>
            <button 
              onClick={() => setShowModal(true)}
              disabled={!isBallotComplete}
              className="btn btn-primary" 
              style={{ 
                padding: '16px 40px', 
                fontSize: '1.1rem', 
                opacity: isBallotComplete ? 1 : 0.5,
                width: '100%',
                maxWidth: '400px'
              }}
            >
              Review & Submit Ballot
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal via Portal to avoid CSS transform trapping */}
      {showModal && createPortal(
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          backdropFilter: 'blur(5px)'
        }}>
          <div className="card fade-in" style={{ 
            maxWidth: '500px', 
            width: '90%', 
            padding: '2rem', 
            display: 'flex', 
            flexDirection: 'column', 
            maxHeight: '90vh',
            boxSizing: 'border-box' 
          }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem', flexShrink: 0 }}>
              <ShieldCheck size={48} color="var(--accent)" style={{ margin: '0 auto 1rem' }} />
              <h2 style={{ margin: 0 }}>Review Your Ballot</h2>
              <p style={{ color: '#666', marginTop: '0.5rem', fontSize: '0.9rem' }}>Please verify your selections. This action cannot be undone.</p>
            </div>
            
            <div style={{ 
              background: '#f8f9fa', 
              borderRadius: 'var(--radius)', 
              padding: '1.5rem', 
              marginBottom: '1.5rem',
              overflowY: 'auto',
              flex: 1
            }}>
              {pendingPositions.map(pos => {
                const selectedCandidateId = selections[pos.id];
                const cand = pos.candidates.find(c => c.id === selectedCandidateId);
                const displayValue = selectedCandidateId === null ? 'Abstain' : (cand?.name || '---');
                return (
                  <div key={pos.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e0e0e0' }}>
                    <span style={{ fontWeight: 600, color: '#555', fontSize: '0.9rem' }}>{pos.title}</span>
                    <span style={{ fontWeight: 700, color: selectedCandidateId === null ? '#999' : 'var(--secondary)', textAlign: 'right', marginLeft: '1rem' }}>
                      {displayValue}
                    </span>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexShrink: 0 }}>
              <button 
                onClick={() => setShowModal(false)} 
                className="btn btn-outline" 
                style={{ flex: 1, padding: '12px' }}
              >
                Go Back & Edit
              </button>
              <button 
                onClick={handleSubmit} 
                disabled={submitting} 
                className="btn btn-primary" 
                style={{ flex: 1, padding: '12px' }}
              >
                {submitting ? 'Submitting...' : 'Confirm & Cast'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
