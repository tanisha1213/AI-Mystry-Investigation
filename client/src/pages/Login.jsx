import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, Lock, Mail, AlertCircle } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate('/history');
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
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
            AGENT IDENTIFICATION
          </div>
          <h2 style={{ fontSize: '24px', color: 'var(--text-primary)', marginBottom: '6px' }}>
            Sign In to Terminal
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Access your persistent case archive and investigative records.
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
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="agent@investigation.internal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
              Access Passcode
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
            {loading ? 'Authenticating...' : 'Sign In to Investigation'}
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
          Don't have an investigator account?{' '}
          <Link to="/register" style={{ fontWeight: 600 }}>
            Register Now
          </Link>
        </div>
      </div>
    </div>
  );
}
