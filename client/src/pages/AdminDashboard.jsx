import React, { useState, useEffect } from 'react';
import api, { getImageUrl } from '../api';
import { useAuth } from '../context/AuthContext';
import { Users, Vote, PlusCircle, CheckCircle, Trash2, Edit2, BarChart2, X, Upload, Download, FileText, UserPlus, ChevronDown, ChevronUp } from 'lucide-react';

// Components
import { Modal, Toast } from '../components/common/UIComponents';
import { NewElectionModal, EditElectionModal } from '../components/admin/ElectionModals';
import { AddCandidateModal, EditCandidateModal } from '../components/admin/CandidateModals';
import { ImportCSVModal, LogsModal } from '../components/admin/ImportCSVModal';
import { VoterListPanel } from '../components/admin/VoterListPanel';

export const AdminDashboard = () => {
  const [elections, setElections] = useState([]);
  const [stats, setStats] = useState({ voterCount: 0, electionCount: 0, totalVotes: 0, turnout: '0.0' });
  const [loading, setLoading] = useState(true);
  const [expandedElection, setExpandedElection] = useState(null);
  const { user } = useAuth();

  const [showNewElection, setShowNewElection] = useState(false);
  const [showEditElection, setShowEditElection] = useState(false);
  const [showAddCandidate, setShowAddCandidate] = useState(false);
  const [showEditCandidate, setShowEditCandidate] = useState(false);
  const [showImportCSV, setShowImportCSV] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [editingElection, setEditingElection] = useState(null);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchData = async () => {
    try {
      const [electionsRes, statsRes] = await Promise.all([ api.get('/admin/elections'), api.get('/admin/stats') ]);
      setElections(electionsRes.data); setStats(statsRes.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const handleDelete = async () => {
    try {
      await api.delete(`/admin/elections/${deleteTarget.id}`);
      showToast('Election deleted successfully');
      setShowDeleteConfirm(false); setDeleteTarget(null); fetchData();
    } catch (err) { showToast(err.response?.data?.error || 'Delete failed', 'error'); }
  };

  async function handleExport(electionId) {
    try {
      const res = await api.get(`/admin/export/${electionId}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a'); link.href = url;
      link.setAttribute('download', `results_${electionId}.csv`);
      document.body.appendChild(link); link.click(); link.remove();
      showToast('Exported results');
    } catch (err) { showToast('Export failed', 'error'); }
  }

  async function handleClearVoters() {
    if (!window.confirm('WARNING: This will delete ALL registered voters and their voting participation records. Are you sure?')) return;
    try {
      await api.delete('/admin/voters');
      showToast('All voters cleared'); fetchData();
    } catch (err) { showToast('Clear failed', 'error'); }
  }

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading admin dashboard...</div>;

  return (
    <div className="fade-in">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div><h1>Admin Dashboard</h1><p style={{ color: '#666' }}>Managing Student Government Council 2026</p></div>
        <button onClick={() => setShowNewElection(true)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><PlusCircle size={18} /> New Election</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="card" style={{ background: 'var(--primary)', color: 'white' }}><Users size={32} color="var(--accent)" /><p style={{ margin: 0, opacity: 0.8 }}>Registered Voters</p><h2 style={{ margin: 0, color: 'white' }}>{stats.voterCount}</h2></div>
        <div className="card"><Vote size={32} color="var(--accent)" /><p style={{ margin: 0, color: '#666' }}>Active Elections</p><h2 style={{ margin: 0 }}>{stats.electionCount}</h2></div>
        <div className="card"><CheckCircle size={32} color="#2e7d32" /><p style={{ margin: 0, color: '#666' }}>Voter Turnout</p><h2 style={{ margin: 0 }}>{stats.turnout}%</h2></div>
        <div className="card"><BarChart2 size={32} color="var(--secondary)" /><p style={{ margin: 0, color: '#666' }}>Total Votes Cast</p><h2 style={{ margin: 0 }}>{stats.totalVotes}</h2></div>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}><h3>Manage Elections</h3><p style={{ fontSize: '0.9rem', color: '#666' }}>{elections.length} election(s)</p></div>
        {elections.length === 0 ? (<p style={{ textAlign: 'center', color: '#999', padding: '2rem' }}>No elections yet.</p>) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}><th style={{ padding: '1rem' }}>Title</th><th style={{ padding: '1rem' }}>Status</th><th style={{ padding: '1rem' }}>Positions</th><th style={{ padding: '1rem' }}>Actions</th></tr></thead>
              <tbody>
                {elections.map((elec) => (
                  <React.Fragment key={elec.id}>
                    <tr style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '1rem', fontWeight: 600 }}><button onClick={() => setExpandedElection(expandedElection === elec.id ? null : elec.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '1rem' }}>{expandedElection === elec.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}{elec.title}</button></td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ 
                          background: elec.status === 'active' ? '#e8f5e9' : elec.status === 'done' ? '#e1f5fe' : elec.status === 'closed' ? '#ffebee' : '#fff3e0', 
                          color: elec.status === 'active' ? '#2e7d32' : elec.status === 'done' ? '#0288d1' : elec.status === 'closed' ? '#c62828' : '#e65100', 
                          padding: '4px 12px', borderRadius: '15px', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600 
                        }}>
                          {elec.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>{elec.positions.length} Positions</td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button onClick={() => { setEditingElection(elec); setShowEditElection(true); }} className="btn btn-outline" style={{ padding: '6px 12px' }}><Edit2 size={14} /></button>
                          <button onClick={() => { setDeleteTarget(elec); setShowDeleteConfirm(true); }} className="btn btn-outline" style={{ padding: '6px 12px', borderColor: '#d32f2f', color: '#d32f2f' }}><Trash2 size={14} /></button>
                          <button onClick={() => handleExport(elec.id)} className="btn btn-outline" style={{ padding: '6px 12px' }}><Download size={14} /></button>
                        </div>
                      </td>
                    </tr>
                    {expandedElection === elec.id && (
                      <tr>
                        <td colSpan="4" style={{ padding: '1.5rem', background: '#f8f9fa' }}>
                          {elec.positions.map(pos => (
                            <div key={pos.id} style={{ marginBottom: '1.5rem' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}><h4 style={{ margin: 0, color: 'var(--secondary)' }}>{pos.title}</h4><button onClick={() => { setShowAddCandidate({ positionId: pos.id, positionTitle: pos.title, electionId: elec.id }); }} className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '0.8rem' }}><UserPlus size={12} /> Add Candidate</button></div>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                                {pos.candidates.map(c => (
                                  <div key={c.id} style={{ padding: '10px 15px', background: 'white', borderRadius: 'var(--radius)', border: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    {c.photoUrl && <img src={getImageUrl(c.photoUrl)} alt={c.name} style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }} />}
                                    <span><strong>{c.name}</strong></span>
                                    <div style={{ display: 'flex', gap: '5px' }}>
                                      <button onClick={() => { setEditingCandidate({ ...c, electionId: elec.id }); setShowEditCandidate(true); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><Edit2 size={14} /></button>
                                      <button onClick={() => handleDeleteCandidate(c.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#d32f2f' }}><X size={14} /></button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div className="card">
          <h3>Quick Actions</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '1.5rem' }}>
            <button onClick={() => setShowImportCSV(true)} className="btn btn-outline" style={{ flex: 1, minWidth: '150px' }}><Upload size={16} /> Import Voters (CSV)</button>
            <button onClick={handleClearVoters} className="btn btn-outline" style={{ flex: 1, minWidth: '150px', borderColor: '#d32f2f', color: '#d32f2f' }}><Trash2 size={16} /> Clear All Voters</button>
            <button onClick={() => setShowLogs(true)} className="btn btn-outline" style={{ flex: 1, minWidth: '150px' }}><FileText size={16} /> Audit Logs</button>
          </div>
        </div>
        <VoterListPanel />
      </div>

      <NewElectionModal isOpen={showNewElection} onClose={() => setShowNewElection(false)} onSuccess={() => { setShowNewElection(false); showToast('Created!'); fetchData(); }} />
      <EditElectionModal isOpen={showEditElection} onClose={() => setShowEditElection(false)} election={editingElection} onSuccess={() => { setShowEditElection(false); showToast('Updated!'); fetchData(); }} />
      <AddCandidateModal isOpen={!!showAddCandidate} onClose={() => setShowAddCandidate(false)} context={showAddCandidate} onSuccess={() => { setShowAddCandidate(false); showToast('Added!'); fetchData(); }} />
      <EditCandidateModal isOpen={showEditCandidate} onClose={() => setShowEditCandidate(false)} candidate={editingCandidate} onSuccess={() => { setShowEditCandidate(false); showToast('Updated!'); fetchData(); }} />
      <ImportCSVModal isOpen={showImportCSV} onClose={() => setShowImportCSV(false)} onSuccess={(msg) => { setShowImportCSV(false); showToast(msg); fetchData(); }} />
      <LogsModal isOpen={showLogs} onClose={() => setShowLogs(false)} />
      <Modal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title="Confirm Delete"><p>Delete <strong>{deleteTarget?.title}</strong>?</p><div style={{ display: 'flex', gap: '1rem' }}><button onClick={() => setShowDeleteConfirm(false)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button><button onClick={handleDelete} className="btn" style={{ flex: 1, background: '#d32f2f', color: 'white' }}>Delete</button></div></Modal>
    </div>
  );
};
