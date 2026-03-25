import React, { useState, useEffect } from 'react';
import api, { getImageUrl } from '../../api';
import { User, Upload, Trash2 } from 'lucide-react';
import { Modal } from '../common/UIComponents';

const labelStyle = { display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem' };
const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: 'var(--radius)', border: '1px solid #ddd', fontSize: '0.95rem', outline: 'none', transition: 'border 0.2s', boxSizing: 'border-box' };

export const AddCandidateModal = ({ isOpen, onClose, context, onSuccess }) => {
  const [name, setName] = useState('');
  const [party, setParty] = useState('');
  const [platform, setPlatform] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handlePhotoChange = (e) => { const file = e.target.files[0]; if (file) { setPhoto(file); setPhotoPreview(URL.createObjectURL(file)); } };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let photoUrl = null;
      if (photo) {
        const formData = new FormData(); formData.append('photo', photo);
        const uploadRes = await api.post('/admin/candidates/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        photoUrl = uploadRes.data.url;
      }
      await api.post('/admin/candidates', { positionId: context.positionId, name, party, platform, photoUrl });
      setName(''); setParty(''); setPlatform(''); setPhoto(null); setPhotoPreview(null);
      onSuccess();
    } catch (err) { alert(err.response?.data?.error || 'Failed'); } finally { setSubmitting(false); }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Add Candidate — ${context?.positionTitle || ''}`}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#f0f0f0', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '2px dashed #ccc' }}>
            {photoPreview ? <img src={photoPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={40} color="#ccc" />}
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <label htmlFor="photo-upload" className="btn btn-outline" style={{ padding: '4px 12px', fontSize: '0.8rem', cursor: 'pointer' }}><Upload size={14} style={{ marginRight: '5px' }} /> Upload Photo</label>
            {(photo || photoPreview) && <button type="button" onClick={() => { setPhoto(null); setPhotoPreview(null); }} className="btn btn-outline" style={{ padding: '4px 12px', fontSize: '0.8rem', borderColor: '#d32f2f', color: '#d32f2f' }}><Trash2 size={14} /></button>}
          </div>
          <input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
        </div>
        <div><label style={labelStyle}>Full Name *</label><input type="text" value={name} onChange={e => setName(e.target.value)} required style={inputStyle} /></div>
        <div><label style={labelStyle}>Party</label><input type="text" value={party} onChange={e => setParty(e.target.value)} style={inputStyle} /></div>
        <div><label style={labelStyle}>Platform</label><textarea value={platform} onChange={e => setPlatform(e.target.value)} placeholder="Summary..." rows={3} style={{ ...inputStyle, resize: 'vertical' }} /></div>
        <button type="submit" disabled={submitting} className="btn btn-primary">{submitting ? 'Adding...' : 'Add Candidate'}</button>
      </form>
    </Modal>
  );
};

export const EditCandidateModal = ({ isOpen, onClose, candidate, onSuccess }) => {
  const [name, setName] = useState('');
  const [party, setParty] = useState('');
  const [platform, setPlatform] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [newPhoto, setNewPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (candidate) {
      setName(candidate.name || ''); setParty(candidate.party || ''); setPlatform(candidate.platform || '');
      setPhotoUrl(candidate.photoUrl || ''); setPhotoPreview(candidate.photoUrl ? getImageUrl(candidate.photoUrl) : null);
      setNewPhoto(null);
    }
  }, [candidate]);

  const handlePhotoChange = (e) => { const file = e.target.files[0]; if (file) { setNewPhoto(file); setPhotoPreview(URL.createObjectURL(file)); } };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let currentPhotoUrl = photoUrl;
      if (newPhoto) {
        const formData = new FormData(); formData.append('photo', newPhoto);
        const uploadRes = await api.post('/admin/candidates/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        currentPhotoUrl = uploadRes.data.url;
      }
      await api.put(`/admin/candidates/${candidate.id}`, { name, party, platform, photoUrl: currentPhotoUrl });
      onSuccess();
    } catch (err) { alert(err.response?.data?.error || 'Failed'); } finally { setSubmitting(false); }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Candidate">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#f0f0f0', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '2px dashed #ccc' }}>
            {photoPreview ? <img src={photoPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={40} color="#ccc" />}
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <label htmlFor="edit-photo-upload" className="btn btn-outline" style={{ padding: '4px 12px', fontSize: '0.8rem', cursor: 'pointer' }}><Upload size={14} style={{ marginRight: '5px' }} /> Update</label>
            {(photoUrl || photoPreview || newPhoto) && <button type="button" onClick={() => { setPhotoUrl(''); setNewPhoto(null); setPhotoPreview(null); }} className="btn btn-outline" style={{ padding: '4px 12px', fontSize: '0.8rem', borderColor: '#d32f2f', color: '#d32f2f' }}><Trash2 size={14} /></button>}
          </div>
          <input id="edit-photo-upload" type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
        </div>
        <div><label style={labelStyle}>Full Name *</label><input type="text" value={name} onChange={e => setName(e.target.value)} required style={inputStyle} /></div>
        <div><label style={labelStyle}>Party</label><input type="text" value={party} onChange={e => setParty(e.target.value)} style={inputStyle} /></div>
        <div><label style={labelStyle}>Platform</label><textarea value={platform} onChange={e => setPlatform(e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical' }} /></div>
        <button type="submit" disabled={submitting} className="btn btn-primary">Save Changes</button>
      </form>
    </Modal>
  );
};
