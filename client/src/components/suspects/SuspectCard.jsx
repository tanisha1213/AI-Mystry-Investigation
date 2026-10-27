import React from 'react';
import { User, Pin, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';

export default function SuspectCard({ suspect, onPinToBoard, onSelectForAccusation, isPinned = false, isSelected = false }) {
  if (!suspect) return null;

  // Generate consistent initial-based avatar styling
  const initials = suspect.name
    ? suspect.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'POI';

  return (
    <div
      style={{
        backgroundColor: 'var(--surface-primary)',
        border: isSelected ? '2px solid var(--danger)' : isPinned ? '2px solid var(--accent)' : '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        position: 'relative',
        transition: 'all var(--transition-fast)',
        boxShadow: isSelected ? '0 0 20px rgba(217, 75, 75, 0.25)' : 'var(--shadow-sm)',
      }}
    >
      {/* Top Header Badge & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--surface-secondary)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            color: 'var(--accent)',
            boxShadow: 'inset 0 0 12px rgba(0,0,0,0.4)',
          }}>
            {initials}
          </div>

          <div>
            <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '2px' }}>
              {suspect.name}
            </h3>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              {suspect.occupation} • Age {suspect.age || 'Unknown'}
            </div>
          </div>
        </div>

        {onPinToBoard && (
          <button
            onClick={() => onPinToBoard(suspect)}
            className="btn btn-secondary"
            style={{
              padding: '6px 10px',
              fontSize: '11px',
              color: isPinned ? 'var(--accent)' : 'var(--text-secondary)',
              borderColor: isPinned ? 'var(--accent)' : 'var(--border)',
            }}
            title="Pin to Evidence Board"
          >
            <Pin size={13} />
            {isPinned ? 'Pinned' : 'Pin'}
          </button>
        )}
      </div>

      {/* Relationship Tag */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span className="badge badge-neutral">Role in Case</span>
        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          {suspect.relationship}
        </span>
      </div>

      {/* Profile Narrative */}
      {suspect.profileDescription && (
        <p style={{
          fontSize: '13.5px',
          color: 'var(--text-secondary)',
          lineHeight: '1.5',
          backgroundColor: 'var(--surface-secondary)',
          padding: '12px 14px',
          borderRadius: 'var(--radius-md)',
          borderLeft: '3px solid var(--border-light)',
        }}>
          "{suspect.profileDescription}"
        </p>
      )}

      {/* Motive & Alibi Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '10px',
        fontSize: '13px',
      }}>
        <div style={{
          backgroundColor: 'rgba(217, 75, 75, 0.06)',
          border: '1px solid rgba(217, 75, 75, 0.2)',
          borderRadius: 'var(--radius-md)',
          padding: '10px 12px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--danger)',
            fontWeight: 600,
            marginBottom: '4px',
            textTransform: 'uppercase',
            fontSize: '11px',
            letterSpacing: '0.05em',
          }}>
            <AlertTriangle size={13} />
            Public Motive / Suspicion
          </div>
          <div style={{ color: 'var(--text-primary)' }}>
            {suspect.publicMotive || 'No explicit motive disclosed.'}
          </div>
        </div>

        <div style={{
          backgroundColor: 'rgba(59, 130, 246, 0.06)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: 'var(--radius-md)',
          padding: '10px 12px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--info)',
            fontWeight: 600,
            marginBottom: '4px',
            textTransform: 'uppercase',
            fontSize: '11px',
            letterSpacing: '0.05em',
          }}>
            <ShieldCheck size={13} />
            Claimed Alibi
          </div>
          <div style={{ color: 'var(--text-primary)' }}>
            {suspect.publicAlibi || 'Alibi unverified or pending interrogation.'}
          </div>
        </div>
      </div>

      {onSelectForAccusation && (
        <button
          onClick={() => onSelectForAccusation(suspect)}
          className={`btn ${isSelected ? 'btn-danger' : 'btn-outline'}`}
          style={{ width: '100%', marginTop: '4px', fontSize: '13px' }}
        >
          {isSelected ? 'Accused as Culprit' : 'Accuse This Suspect'}
        </button>
      )}
    </div>
  );
}
