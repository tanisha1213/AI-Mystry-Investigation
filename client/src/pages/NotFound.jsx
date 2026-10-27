import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{
      maxWidth: '540px',
      margin: '80px auto',
      textAlign: 'center',
      padding: '0 24px',
    }}>
      <AlertTriangle size={48} color="var(--accent)" style={{ marginBottom: '16px' }} />
      <h1 style={{ fontSize: '36px', color: 'var(--text-primary)', marginBottom: '8px' }}>
        404 — Case File Missing
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
        The requested crime scene or investigation terminal could not be located in our records.
      </p>
      <Link to="/" className="btn btn-primary">
        Return to Headquarters
      </Link>
    </div>
  );
}
