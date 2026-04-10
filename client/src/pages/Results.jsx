import React, { useState, useEffect } from 'react';
import api, { getImageUrl } from '../api';
import Chart from 'react-apexcharts';
import { Trophy, Users, Info } from 'lucide-react';

export const Results = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await api.get('/results/all');
        setElections(res.data);
      } catch (err) {
        setError('Failed to fetch election results. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading results...</div>;
  if (error) return <div className="card" style={{ color: 'var(--accent)', border: '1px solid var(--accent)', padding: '2rem', textAlign: 'center' }}>{error}</div>;

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem' }}>Live Election Results</h1>
        <p style={{ color: '#666' }}>Transparency and integrity in every vote. Last updated: {new Date().toLocaleTimeString()}</p>
      </div>

      {elections.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <Info size={48} color="#ccc" style={{ marginBottom: '1rem' }} />
          <h3>Results Pending</h3>
          <p>The results will be available once the election period ends.</p>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {elections.map((election) => {
              const isFinished = new Date() > new Date(election.endDate);
              
              return (
                <div key={election.id} className="card" style={{ border: isFinished ? '2px solid #fbc02d' : '1px solid #eee' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '1rem', marginBottom: '2rem' }}>
                    <h2 style={{ margin: 0 }}>{election.title} Results</h2>
                    {isFinished && (
                      <span style={{ background: '#fbc02d', color: '#f57f17', padding: '6px 16px', borderRadius: '30px', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                        Official Result
                      </span>
                    )}
                  </div>

                  {election.positions.map((pos) => {
                    const labels = pos.candidates.map(c => c.name);
                    const dataValues = pos.candidates.map(c => c.voteCount || 0);
                    const totalVotes = dataValues.reduce((a, b) => a + b, 0);
                    const maxVotes = Math.max(...dataValues, -1);
                    const winnerIndex = dataValues.indexOf(maxVotes);
                    const winner = pos.candidates[winnerIndex];

                    // Check for ties
                    const winningCandidates = pos.candidates.filter((c, idx) => dataValues[idx] === maxVotes && maxVotes >= 0);
                    const isTie = winningCandidates.length > 1;

                    const chartSeries = [{
                      name: 'Votes',
                      data: dataValues
                    }];

                    // Use the original chartOptions (assuming they are defined or redefined here)
                    const chartOptions = {
                      chart: {
                        type: 'bar',
                        toolbar: { show: false },
                        animations: { enabled: true, easing: 'easeinout', speed: 800 }
                      },
                      plotOptions: {
                        bar: {
                          horizontal: true,
                          borderRadius: 4,
                          dataLabels: { position: 'top' },
                          barHeight: '70%',
                          distributed: true
                        }
                      },
                      colors: ['#e94560', '#0f3460', '#2e7d32', '#9c27b0', '#ff9800', '#00bcd4'],
                      dataLabels: {
                        enabled: true,
                        offsetX: 20,
                        style: { fontSize: '12px', colors: ['#333'] },
                        formatter: (val) => val + " Votes"
                      },
                      xaxis: { categories: labels },
                      legend: { show: false }
                    };

                    const getPercent = (val) => totalVotes > 0 ? ((val / totalVotes) * 100).toFixed(1) : '0.0';
                    const dynamicHeight = Math.max(150, labels.length * 60 + 50);

                    return (
                      <div key={pos.id} style={{ marginBottom: '4rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                          <h3 style={{ margin: 0, color: 'var(--secondary)' }}>{pos.title}</h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#666' }}>
                            <Users size={16} /> Total Ballots: <strong>{totalVotes}</strong>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
                          
                          {/* Winner/Leader Card */}
                          {winner && totalVotes > 0 && (
                            <div style={{ 
                              background: isFinished ? '#fff9c4' : '#f8f9fa', 
                              border: isFinished ? '2px solid #fbc02d' : '1px solid #eee', 
                              padding: '1.5rem', 
                              borderRadius: 'var(--radius)', 
                              position: 'relative', 
                              overflow: 'hidden',
                              boxShadow: isFinished ? '0 10px 20px rgba(251, 192, 45, 0.15)' : 'none'
                            }}>
                              <Trophy size={64} color="#fbc02d" style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: isFinished ? 0.4 : 0.1, transform: 'rotate(15deg)' }} />
                              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
                                {winner.photoUrl && (
                                  <img src={getImageUrl(winner.photoUrl)} alt={winner.name} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '4px solid white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                )}
                                <div>
                                  <h4 style={{ margin: 0, fontSize: '0.9rem', color: isFinished ? '#f57f17' : '#666', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>
                                    {isFinished ? (isTie ? 'Tie Result' : 'Official Winner') : 'Currently Leading'}
                                  </h4>
                                  <h2 style={{ margin: '0.4rem 0', color: '#333', fontSize: '1.8rem' }}>
                                    {isTie ? winningCandidates.map(c => c.name).join(' & ') : winner.name}
                                  </h2>
                                  <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600, color: isFinished ? '#f57f17' : 'var(--secondary)' }}>
                                    {dataValues[winnerIndex]} Votes ({getPercent(dataValues[winnerIndex])}%)
                                  </p>
                                </div>
                              </div>
                              {isFinished && !isTie && (
                                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(245, 127, 23, 0.1)', color: '#f57f17', fontSize: '0.9rem', fontWeight: 500 }}>
                                  🎊 Congratulations to the newly elected {pos.title}!
                                </div>
                              )}
                            </div>
                          )}

                          {!winner && totalVotes === 0 && (
                            <div style={{ background: '#f0f0f0', padding: '1.5rem', borderRadius: 'var(--radius)', textAlign: 'center' }}>
                              <p style={{ margin: 0, color: '#999', fontWeight: 600 }}>No votes cast yet</p>
                            </div>
                          )}

                          {/* Bar Chart */}
                          <div style={{ padding: '1rem', background: '#ffffff', border: '1px solid #eee', borderRadius: 'var(--radius)', width: '100%' }}>
                             {totalVotes > 0 ? (
                               <Chart 
                                 options={chartOptions} 
                                 series={chartSeries} 
                                 type="bar" 
                                 height={dynamicHeight} 
                                 width="100%"
                               />
                             ) : (
                               <div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                                 Waiting for votes...
                               </div>
                             )}
                          </div>

                          {/* Candidate Ranking */}
                          {totalVotes > 0 && (
                            <div className="candidate-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {pos.candidates.sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0)).map((c, i) => (
                                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', background: i === 0 && isFinished && !isTie ? '#fffde7' : 'white', borderRadius: '10px', border: i === 0 && isFinished && !isTie ? '1px solid #fbc02d' : '1px solid #eee' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <span style={{ width: '25px', height: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: i === 0 ? '#fbc02d' : '#f0f0f0', color: i === 0 ? 'white' : '#666', borderRadius: '50%', fontSize: '0.8rem', fontWeight: 'bold' }}>{i + 1}</span>
                                    {c.photoUrl && (
                                      <img src={getImageUrl(c.photoUrl)} alt={c.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                                    )}
                                    <span style={{ fontWeight: i === 0 ? 600 : 400 }}>{c.name} {c.party ? <small style={{ color: '#999', fontWeight: 400 }}>— {c.party}</small> : ''}</span>
                                  </div>
                                  <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: 700 }}>{c.voteCount || 0} <small style={{ fontWeight: 400, color: '#666' }}>Votes</small></div>
                                    <div style={{ fontSize: '0.75rem', color: '#888' }}>{getPercent(c.voteCount || 0)}%</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
        </div>
        </>
      )}
    </div>
  );
};
