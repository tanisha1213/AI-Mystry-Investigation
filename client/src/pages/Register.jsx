import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, AlertCircle } from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/history');
    } catch (err) {
      setError(err.message || 'Registration failed. Email may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '440px',
      margin: '60px auto',
      padding: '0 24px',
    }}>
      <div style={{
        backgroundColor: 'var(--surface-primary)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '32px',
        boxShadow: 'var(--shadow-md)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div className="case-stamp" style={{ marginBottom: '10px' }}>
            CREDENTIAL RECRUITMENT
          </div>
          <h2 style={{ fontSize: '24px', color: 'var(--text-primary)', marginBottom: '6px' }}>
            Register Detective Dossier
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Establish a verified investigator identity to preserve mystery archives across devices.
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'var(--danger-subtle)',
            border: '1px solid var(--danger)',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            color: 'var(--danger)',
            fontSize: '13px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
              Investigator Full Name
            </label>
            <input
              type="text"
              required
              placeholder="Det. Alex Vance"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
              Official Email
            </label>
            <input
              type="email"
              required
              placeholder="alex@investigation.internal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
              Security Passcode (min 6 chars)
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', marginTop: '8px' }}
          >
            {loading ? 'Registering...' : 'Create Investigator Profile'}
          </button>
        </form>

        <div style={{
          marginTop: '24px',
          textAlign: 'center',
          fontSize: '13px',
          color: 'var(--text-secondary)',
          borderTop: '1px solid var(--border)',
          paddingTop: '16px',
        }}>
          Already have credentials?{' '}
          <Link to="/login" style={{ fontWeight: 600 }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
