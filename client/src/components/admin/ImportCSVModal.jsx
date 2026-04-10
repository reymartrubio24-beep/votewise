import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Upload } from 'lucide-react';
import { Modal } from '../common/UIComponents';

export const ImportCSVModal = ({ isOpen, onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const handleUpload = async (e) => {
    e.preventDefault(); if (!file) return; setUploading(true);
    const formData = new FormData(); formData.append('file', file);
    try {
      const res = await api.post('/admin/voters/import', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      onSuccess(`Imported ${res.data.imported} voters!`);
    } catch (err) { alert(err.response?.data?.error || 'Import failed'); } finally { setUploading(false); }
  };
  return (
    <Modal isOpen={isOpen} onClose={() => { onClose(); setFile(null); }} title="Import Voters (CSV)">
      <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ border: '2px dashed #ddd', borderRadius: 'var(--radius)', padding: '2rem', textAlign: 'center', background: file ? '#e8f5e9' : '#f8f9fa' }}>
          <input type="file" accept=".csv" onChange={e => setFile(e.target.files[0])} style={{ display: 'none' }} id="csv-upload" />
          <label htmlFor="csv-upload" style={{ cursor: 'pointer' }}><Upload size={32} color={file ? '#2e7d32' : '#666'} /><p style={{ margin: 0 }}>{file ? file.name : 'Select CSV file'}</p></label>
        </div>
        <button type="submit" disabled={uploading || !file} className="btn btn-primary">{uploading ? 'Importing...' : 'Upload'}</button>
      </form>
    </Modal>
  );
};

export const LogsModal = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState([]);
  useEffect(() => { if (isOpen) api.get('/admin/logs').then(res => setLogs(res.data)).catch(() => setLogs([])); }, [isOpen]);
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Audit Logs">
      <div style={{ maxHeight: '500px', overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left', background: '#f8f9fa' }}>
              <th style={{ padding: '12px 8px' }}>Voter Hash</th>
              <th style={{ padding: '12px 8px' }}>Position</th>
              <th style={{ padding: '12px 8px' }}>IP Adress</th>
              <th style={{ padding: '12px 8px' }}>Time</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>No logs recorded yet.</td></tr>
            ) : (
              logs.map(log => (
                <tr key={log.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px 8px', fontFamily: 'monospace', color: 'var(--secondary)' }}>{log.voterHash}</td>
                  <td style={{ padding: '10px 8px' }}>{log.positionTitle}</td>
                  <td style={{ padding: '10px 8px', color: '#666', fontSize: '0.75rem' }}>{log.ipAddress || '—'}</td>
                  <td style={{ padding: '10px 8px' }}>{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Modal>
  );
};
