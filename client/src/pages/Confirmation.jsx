import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Download, Share2, Home } from 'lucide-react';

export const Confirmation = () => {
  const receiptNo = `VW-${Math.floor(Math.random() * 999999).toString().padStart(6, '0')}`;

  const handleDownloadCSV = () => {
    const timestamp = new Date().toLocaleString().replace(/,/g, ''); 
    const csvContent = `"Receipt Number","Timestamp","Status"\n"${receiptNo}","${timestamp}","Vote Cast Successfully"`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `VoteWise_Receipt_${receiptNo}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', textAlign: 'center' }} className="fade-in">
      <div className="card glass" style={{ padding: '3rem 2rem', borderTop: '6px solid #2e7d32' }}>
        <CheckCircle size={80} color="#2e7d32" style={{ marginBottom: '2rem' }} />
        <h1 style={{ marginBottom: '1rem' }}>Vote Cast Successfully!</h1>
        <p style={{ fontSize: '1.25rem', color: '#666', marginBottom: '2.5rem' }}>
          Thank you for participating in the Student Government Election 2026. Your voice has been heard!
        </p>

        <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px dashed #ccc', marginBottom: '2.5rem', textAlign: 'left' }}>
          <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>Electronic Receipt</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>Receipt No: {receiptNo}</h3>
            <span style={{ fontSize: '0.85rem', color: '#666' }}>{new Date().toLocaleString()}</span>
          </div>
          <p style={{ margin: '15px 0 0 0', fontSize: '0.85rem', color: '#888' }}>
            This receipt confirms that your ballot has been securely received and recorded anonymously in our system. 
            Keep this number for your records.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button onClick={handleDownloadCSV} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={18} /> Download Receipt
          </button>
          <Link to="/" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Home size={18} /> Back to Home
          </Link>
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <p style={{ color: '#888', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <Share2 size={16} /> Encourage your fellow voters to vote!
        </p>
      </div>
    </div>
  );
};
