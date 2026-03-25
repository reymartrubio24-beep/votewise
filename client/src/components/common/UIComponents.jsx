import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return createPortal(
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: 99999, backdropFilter: 'blur(5px)'
    }}>
      <div className="card fade-in" style={{ 
        maxWidth: '600px', width: '90%', maxHeight: '90vh', 
        overflowY: 'auto', padding: '2rem', position: 'relative',
        boxSizing: 'border-box'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '15px', right: '15px',
          background: 'none', border: 'none', cursor: 'pointer', padding: '5px'
        }}><X size={20} /></button>
        <h2 style={{ marginBottom: '1.5rem', paddingRight: '2rem' }}>{title}</h2>
        {children}
      </div>
    </div>,
    document.body
  );
};

export const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div style={{
      position: 'fixed', top: '20px', right: '20px', zIndex: 100000,
      padding: '1rem 1.5rem', borderRadius: 'var(--radius)',
      background: type === 'success' ? '#2e7d32' : '#d32f2f',
      color: 'white', fontWeight: 600, boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
      animation: 'fadeIn 0.3s ease'
    }}>
      {message}
    </div>
  );
};
