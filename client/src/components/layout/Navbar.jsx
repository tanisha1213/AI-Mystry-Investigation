import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Search, ShieldAlert, PlusCircle, User, LogOut, Briefcase } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header style={{
      borderBottom: '1px solid var(--border)',
      backgroundColor: 'rgba(17, 21, 29, 0.85)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--accent-subtle)',
            border: '1px solid var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent)',
          }}>
            <Search size={20} />
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: '18px',
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              AI MYSTERY ROOM
            </div>
            <div style={{
              fontSize: '10px',
              color: 'var(--accent)',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}>
              Investigation Terminal
            </div>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link
            to="/create"
            className="btn btn-primary"
            style={{ padding: '8px 16px', fontSize: '13px' }}
          >
            <PlusCircle size={16} />
            Create Mystery
          </Link>

          <Link
            to="/history"
            style={{
              color: location.pathname === '/history' ? 'var(--accent)' : 'var(--text-secondary)',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Briefcase size={16} />
            Case Dossiers
          </Link>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--surface-secondary)',
                border: '1px solid var(--border)',
                fontSize: '13px',
              }}>
                <User size={14} color="var(--accent)" />
                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '12px' }}
                title="Sign out"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '13px' }}>
                Login
              </Link>
              <Link to="/register" className="btn btn-outline" style={{ padding: '8px 14px', fontSize: '13px' }}>
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
