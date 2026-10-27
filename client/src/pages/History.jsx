import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiListCases } from '../services/api';
import { Briefcase, Search, ArrowRight, Clock, Award, ShieldAlert } from 'lucide-react';

export default function History() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCases() {
      try {
        const res = await apiListCases();
        setCases(res.data || []);
      } catch (err) {
        console.error('Failed to list cases:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCases();
  }, []);

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '40px 24px 80px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div>
          <div className="case-stamp" style={{ marginBottom: '8px' }}>
            ARCHIVE DIVISION
          </div>
          <h1 style={{ fontSize: '32px', color: 'var(--text-primary)', marginBottom: '6px' }}>
            Investigation Dossiers & History
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Active investigations and archived cases recorded under your session.
          </p>
        </div>

        <Link to="/create" className="btn btn-primary" style={{ padding: '10px 20px' }}>
          + New Mystery Case
        </Link>
      </div>

      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Loading case files...
        </div>
      ) : cases.length === 0 ? (
        <div style={{
          backgroundColor: 'var(--surface-primary)',
          border: '1px dashed var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '60px 20px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
        }}>
          <Briefcase size={40} color="var(--accent)" />
          <h3 style={{ fontSize: '20px', color: 'var(--text-primary)' }}>
            No Active or Archived Investigations Found
          </h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', fontSize: '14px' }}>
            You haven’t started any cases yet. Describe a scenario and launch your first digital investigation room.
          </p>
          <Link to="/create" className="btn btn-primary">
            Launch Your First Case
          </Link>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px',
        }}>
          {cases.map((c) => (
            <div
              key={c._id}
              style={{
                backgroundColor: 'var(--surface-primary)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                transition: 'all var(--transition-fast)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge badge-accent">{c.caseCode}</span>
                <span className="badge badge-neutral">{c.difficulty}</span>
              </div>

              <div>
                <h3 style={{ fontSize: '17px', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {c.title}
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Category: {c.category}
                </span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid var(--border)',
                paddingTop: '14px',
                marginTop: 'auto',
              }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} />
                  {new Date(c.createdAt).toLocaleDateString()}
                </span>

                <Link
                  to={`/investigation/${c._id}`}
                  className="btn btn-secondary"
                  style={{ fontSize: '12px', padding: '6px 12px' }}
                >
                  Enter Room &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
