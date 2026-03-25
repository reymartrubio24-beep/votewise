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
            {elections.map((election) => (
              <div key={election.id} className="card">
              <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '1rem', marginBottom: '2rem' }}>{election.title}</h2>

              {election.positions.map((pos) => {
                const labels = pos.candidates.map(c => c.name);
                const dataValues = pos.candidates.map(c => c.voteCount || 0);
                const totalVotes = dataValues.reduce((a, b) => a + b, 0);
                const maxVotes = Math.max(...dataValues, 0);
                const winnerIndex = dataValues.indexOf(maxVotes);
                const winner = pos.candidates[winnerIndex];

                const chartSeries = [{
                  name: 'Votes',
                  data: dataValues
                }];

                const chartOptions = {
                  chart: {
                    type: 'bar',
                    toolbar: { show: false },
                    animations: {
                      enabled: true,
                      easing: 'easeinout',
                      speed: 800,
                      animateGradually: {
                          enabled: true,
                          delay: 150
                      },
                      dynamicAnimation: {
                          enabled: true,
                          speed: 350
                      }
                    }
                  },
                  plotOptions: {
                    bar: {
                      horizontal: true,
                      borderRadius: 4,
                      dataLabels: { position: 'top' },
                      barHeight: '70%',
                      distributed: true // Gives different colors per bar
                    }
                  },
                  colors: [
                    '#e94560', '#0f3460', '#2e7d32', '#9c27b0', '#ff9800', '#00bcd4'
                  ],
                  dataLabels: {
                    enabled: true,
                    offsetX: 20,
                    style: {
                      fontSize: '12px',
                      colors: ['#333']
                    },
                    formatter: function (val) {
                      return val + " Votes";
                    }
                  },
                  stroke: {
                    show: true,
                    width: 1,
                    colors: ['#fff']
                  },
                  tooltip: {
                    shared: true,
                    intersect: false,
                    theme: 'light'
                  },
                  xaxis: {
                    categories: labels,
                    labels: {
                      formatter: function (val) {
                        return Math.round(val);
                      }
                    }
                  },
                  legend: { show: false }
                };

                const getPercent = (val) => totalVotes > 0 ? ((val / totalVotes) * 100).toFixed(1) : '0.0';
                // Calculate dynamic height based on candidate count so bars don't get squished
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
                      
                      {/* Leader Card */}
                      {winner && totalVotes > 0 && (
                        <div style={{ background: '#fff9c4', border: '1px solid #fbc02d', padding: '1.5rem', borderRadius: 'var(--radius)', position: 'relative', overflow: 'hidden' }}>
                          <Trophy size={48} color="#fbc02d" style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.2 }} />
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            {winner.photoUrl && (
                              <img src={getImageUrl(winner.photoUrl)} alt={winner.name} style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '3px solid white', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }} />
                            )}
                            <div>
                              <h4 style={{ margin: 0, fontSize: '0.8rem', color: '#f57f17', textTransform: 'uppercase', letterSpacing: '1px' }}>Currently Leading</h4>
                              <h2 style={{ margin: '0.2rem 0', color: '#333' }}>{winner.name}</h2>
                            </div>
                          </div>
                          <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: '#f57f17' }}>
                            {dataValues[winnerIndex]} Votes ({getPercent(dataValues[winnerIndex])}%)
                          </p>
                        </div>
                      )}

                      {!winner && totalVotes === 0 && (
                        <div style={{ background: '#f0f0f0', padding: '1.5rem', borderRadius: 'var(--radius)', textAlign: 'center' }}>
                          <p style={{ margin: 0, color: '#999', fontWeight: 600 }}>No votes cast yet</p>
                        </div>
                      )}

                      {/* Bar Chart */}
                      <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: 'var(--radius)', width: '100%' }}>
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
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {pos.candidates.map((c, i) => (
                            <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 15px', borderBottom: '1px solid #eee' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                {c.photoUrl && (
                                  <img src={getImageUrl(c.photoUrl)} alt={c.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                                )}
                                <span style={{ fontWeight: 500 }}>{c.name} {c.party ? `(${c.party})` : ''}</span>
                              </div>
                              <span style={{ fontWeight: 600 }}>{dataValues[i]} ({getPercent(dataValues[i])}%)</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        </>
      )}
    </div>
  );
};
