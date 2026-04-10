import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Vote, ChartBar } from 'lucide-react';
import api from '../api';

export const Home = () => {
  const [election, setElection] = useState(null);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    seconds: 0,
    minutes: 0,
  });

  useEffect(() => {
    const fetchElection = async () => {
      try {
        const { data } = await api.get('/election/countdown');
        setElection(data);
        if (data && new Date() > new Date(data.endDate)) {
          setIsTimeUp(true);
        }
      } catch (err) {
        console.error('Error fetching election:', err);
      }
    };
    fetchElection();
  }, []);

  useEffect(() => {
    if (!election) return;

    const targetDate = new Date(election.status === 'active' ? election.endDate : election.startDate);

    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        if (election.status === 'active') setIsTimeUp(true);
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [election]);

  return (
    <div style={{ textAlign: 'center' }}>
      <header className="fade-in" style={{ padding: '4rem 0' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>Your Voice Matters</h1>
        <p style={{ fontSize: '1.25rem', color: '#666', maxWidth: '800px', margin: '0 auto 2.5rem' }}>
          Secure, transparent, and modern student government voting for our academic community.
        </p>
        <Link to="/login" className="btn btn-primary" style={{ fontSize: '1.2rem', padding: '16px 40px' }}>
          Get Started & Vote Now
        </Link>
      </header>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '2rem',
        marginTop: '3rem'
      }}>
        <div className="card">
          <ShieldCheck size={48} color="var(--accent)" style={{ marginBottom: '1rem' }} />
          <h3>Secure & Anonymous</h3>
          <p>Your identity is protected. We use advanced encryption to ensure your vote stays private.</p>
        </div>
        <div className="card">
          <Vote size={48} color="var(--accent)" style={{ marginBottom: '1rem' }} />
          <h3>One Vote Policy</h3>
          <p>Every student is entitled to one vote per position. Our system enforces strict eligibility controls.</p>
        </div>
        <div className="card">
          <ChartBar size={48} color="var(--accent)" style={{ marginBottom: '1rem' }} />
          <h3>Real-time Results</h3>
          <p>Election officers and students can monitor live updates as votes are tallied fairly.</p>
        </div>
      </div>

      <div className="card" style={{
        marginTop: '4rem',
        background: 'var(--primary)',
        color: 'white',
        padding: '3rem'
      }}>
        {election ? (
          <>
            <h2 style={{ color: 'white', marginBottom: '2rem' }}>{election.title} Countdown</h2>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
              <div className="timer-box">
                 <span style={{ fontSize: '3rem', fontWeight: 'bold' }}>{timeLeft.days}</span>
                 <p>Days</p>
              </div>
              <div className="timer-box">
                 <span style={{ fontSize: '3rem', fontWeight: 'bold' }}>{timeLeft.hours}</span>
                 <p>Hours</p>
              </div>
              <div className="timer-box">
                 <span style={{ fontSize: '3rem', fontWeight: 'bold' }}>{timeLeft.minutes}</span>
                 <p>Minutes</p>
              </div>
              <div className="timer-box">
                 <span style={{ fontSize: '3rem', fontWeight: 'bold' }}>{timeLeft.seconds}</span>
                 <p>Seconds</p>
              </div>
            </div>
            {isTimeUp && election.status === 'active' ? (
              <div style={{ marginTop: '2.5rem' }}>
                <Link to="/results" className="btn" style={{ background: 'white', color: 'var(--primary)', padding: '12px 30px' }}>
                   View Final Election Results
                </Link>
                <p style={{ marginTop: '1rem', opacity: 0.8 }}>This election has officially ended.</p>
              </div>
            ) : (
              <p style={{ marginTop: '2rem', opacity: 0.8 }}>
                {election.status === 'active' ? 'Time remaining until the polls close' : 'Time until the polls open'}
              </p>
            )}
          </>
        ) : (
          <h2 style={{ color: 'white' }}>No Upcoming Elections</h2>
        )}
      </div>

      <style>{`
        .timer-box {
          background: rgba(255, 255, 255, 0.1);
          padding: 1rem 2rem;
          border-radius: var(--radius);
          min-width: 120px;
        }
      `}</style>
    </div>
  );
};
