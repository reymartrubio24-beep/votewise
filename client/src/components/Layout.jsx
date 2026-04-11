import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Vote, ShieldCheck, Home as HomeIcon, Menu, X, BarChart, User, Settings, ArrowLeft } from 'lucide-react';
import { ChangePasswordModal } from './admin/ChangePasswordModal';

export const Layout = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 768);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setIsCollapsed(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Render navigation item helper
  const NavItem = ({ to, icon, label }) => {
    const isActive = location.pathname === to;
    return (
      <Link 
        to={to} 
        style={{
          display: 'flex', alignItems: 'center', gap: '15px', padding: '12px 20px',
          color: isActive ? 'white' : 'rgba(255,255,255,0.7)', textDecoration: 'none',
          background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
          borderLeft: isActive ? '4px solid var(--accent)' : '4px solid transparent',
          transition: 'all 0.2s', justifyContent: isCollapsed && !isMobile ? 'center' : 'flex-start'
        }}
        onClick={() => { if (isMobile) setIsCollapsed(true); }}
        onMouseOver={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'white'; }}
        onMouseOut={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
      >
        <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>
        {(!isCollapsed || isMobile) && <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>{label}</span>}
      </Link>
    );
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-light)' }}>
      {/* SIDEBAR */}
      <aside style={{
        width: isCollapsed ? '80px' : '260px',
        backgroundColor: 'var(--primary)',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        position: 'fixed',
        height: '100vh',
        left: isMobile && isCollapsed ? '-260px' : '0',
        zIndex: 1002, /* Higher than mobile header and overlay */
        boxShadow: '4px 0 15px rgba(0,0,0,0.1)'
      }}>
        {/* LOGO & TOGGLE */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: isCollapsed && !isMobile ? 'center' : 'space-between',
          padding: '20px',
          borderBottom: '1px solid rgba(255,255,255,0.05)'
        }}>
          {(!isCollapsed || isMobile) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px', height: '36px', background: 'var(--accent)',
                borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 'bold', fontSize: '1.2rem', color: 'white'
              }}>V</div>
              <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'white' }}>VoteWise</h2>
            </div>
          )}
          {!isMobile && (
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              style={{ 
                background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', 
                padding: isCollapsed ? '0' : '5px',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              {isCollapsed ? <Menu size={28} /> : <Menu size={24} />}
            </button>
          )}
        </div>

        {/* NAVIGATION LINKS */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '20px' }}>
          {!(location.pathname.startsWith('/admin') || (isAuthenticated && user?.role === 'admin')) && (
            <NavItem to="/" icon={<HomeIcon size={22} />} label="Home" />
          )}
          <NavItem to="/results" icon={<BarChart size={22} />} label="Live Results" />
          
          {isAuthenticated && user?.role === 'voter' && (
            <NavItem to="/dashboard" icon={<Vote size={22} />} label="My Ballot" />
          )}
          {isAuthenticated && user.role === 'admin' && (
            <NavItem to="/admin" icon={<ShieldCheck size={22} />} label="Admin Dashboard" />
          )}

          {!isAuthenticated && (
            <>
              <div style={{ margin: '20px 0 10px', padding: '0 20px' }}>
                {!isCollapsed && <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>Access Portal</p>}
                {isCollapsed && <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', width: '100%', margin: '10px 0' }}></div>}
              </div>
              {!location.pathname.startsWith('/admin') && <NavItem to="/login" icon={<User size={22} />} label="Student Login" />}
              {location.pathname !== '/login' && <NavItem to="/admin/login" icon={<ShieldCheck size={22} />} label="Admin Login" />}
            </>
          )}
        </nav>

        {/* LOGOUT / USER PROFILE */}
        {isAuthenticated && (
          <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: 'auto' }}>
            {(!isCollapsed || isMobile) && (
              <div style={{ marginBottom: '15px' }}>
                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: 'white' }}>{user.name || user.username}</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
                  ID: {user.studentId || user.username}
                </p>
              </div>
            )}
            {user.role === 'admin' && (
              <button 
                onClick={() => setShowPasswordModal(true)} 
                style={{
                  width: '100%', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', 
                  color: 'white', padding: '10px', borderRadius: 'var(--radius)', 
                  cursor: 'pointer', display: 'flex', alignItems: 'center', 
                  justifyContent: (isCollapsed && !isMobile) ? 'center' : 'flex-start',
                  gap: '10px', fontWeight: 600, transition: 'all 0.2s', marginBottom: '10px'
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <Settings size={20} />
                {(!isCollapsed || isMobile) && "Change Password"}
              </button>
            )}
            <button 
              onClick={handleLogout} 
              style={{
                width: '100%', background: 'rgba(233, 69, 96, 0.1)', border: '1px solid var(--accent)', 
                color: 'var(--accent)', padding: '10px', borderRadius: 'var(--radius)', 
                cursor: 'pointer', display: 'flex', alignItems: 'center', 
                justifyContent: (isCollapsed && !isMobile) ? 'center' : 'flex-start',
                gap: '10px', fontWeight: 600, transition: 'all 0.2s'
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = 'white'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(233, 69, 96, 0.1)'; e.currentTarget.style.color = 'var(--accent)'; }}
            >
              <LogOut size={20} />
              {(!isCollapsed || isMobile) && "Logout"} {/* Show "Logout" when not collapsed or on mobile */}
            </button>
          </div>
        )}
      </aside>

      {/* MOBILE HEADER (Only Visible on Small Screens) */}
      {isMobile && (
        <header style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '60px',
          background: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          zIndex: 1001,
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'var(--accent)', borderRadius: '8px', padding: '6px' }}>
              <Vote size={20} color="white" />
            </div>
            <h2 style={{ margin: 0, color: 'white', fontSize: '1.2rem' }}>VoteWise</h2>
          </div>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
          >
            {isCollapsed ? <Menu size={28} /> : <X size={28} />}
          </button>
        </header>
      )}

      {/* MAIN CONTENT AREA */}
      <main style={{ 
        flex: 1, 
        marginLeft: isMobile ? '0' : (isCollapsed ? '80px' : '260px'), 
        marginTop: isMobile ? '60px' : '0',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        minHeight: isMobile ? 'calc(100vh - 60px)' : '100vh',
        width: isMobile ? '100%' : (isCollapsed ? 'calc(100% - 80px)' : 'calc(100% - 260px)')
      }}>
        <div style={{ flex: 1, padding: isMobile ? '1.5rem 1rem' : '2rem 3rem', display: 'flex', flexDirection: 'column' }} className="fade-in">
          {(location.pathname === '/login' || location.pathname === '/admin/login') && (
            <div style={{ marginBottom: '2rem' }}>
              <Link 
                to="/results" 
                style={{ 
                  display: 'inline-flex', alignItems: 'center', gap: '6px', 
                  color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 500, 
                  textDecoration: 'none', transition: 'color 0.2s ease',
                  padding: '4px 8px', marginLeft: '-8px'
                }}
                onMouseOver={(e) => { e.currentTarget.style.color = 'var(--accent)'; }}
                onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                <ArrowLeft size={18} />
                Back to Portals
              </Link>
            </div>
          )}
          <Outlet />
        </div>
        
        {/* Simple Footer */}
        <footer style={{ 
          textAlign: 'center', 
          padding: '1.5rem', 
          borderTop: '1px solid rgba(0,0,0,0.05)', 
          color: '#888',
          fontSize: '0.9rem' 
        }}>
          &copy; {new Date().getFullYear()} VoteWise - Modern Student Government Election Portal
        </footer>
      </main>

      {/* Mobile Overlay Background */}
      {isMobile && !isCollapsed && (
        <div 
          onClick={() => setIsCollapsed(true)}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', zIndex: 999
          }}
        />
      )}
      <ChangePasswordModal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} />
    </div>
  );
};
