import React from 'react';
import { Clock, AlertCircle, User, ArrowRight } from 'lucide-react';

export default function Timeline({ timeline = [] }) {
  if (!timeline || timeline.length === 0) {
    return (
      <div style={{
        padding: '32px',
        textAlign: 'center',
        color: 'var(--text-muted)',
        backgroundColor: 'var(--surface-primary)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
      }}>
        No verified timeline events recorded for this investigation yet.
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: 'var(--surface-primary)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border)',
      padding: '24px',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '24px',
        borderBottom: '1px solid var(--border)',
        paddingBottom: '14px',
      }}>
        <Clock size={20} color="var(--accent)" />
        <h3 style={{ fontSize: '18px', color: 'var(--text-primary)' }}>
          Verified Incident Timeline
        </h3>
        <span className="badge badge-accent" style={{ marginLeft: 'auto' }}>
          {timeline.length} Key Checkpoints
        </span>
      </div>

      <div style={{
        position: 'relative',
        paddingLeft: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}>
        {/* Continuous vertical timeline line */}
        <div style={{
          position: 'absolute',
          top: '8px',
          bottom: '8px',
          left: '7px',
          width: '2px',
          backgroundColor: 'var(--border-light)',
        }} />

        {timeline.map((item, idx) => (
          <div
            key={idx}
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            {/* Timeline Node Point */}
            <div style={{
              position: 'absolute',
              left: '-24px',
              top: '4px',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg)',
              border: '2px solid var(--accent)',
              boxShadow: '0 0 8px var(--accent-subtle)',
            }} />

            {/* Time & Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                fontWeight: 700,
                color: 'var(--accent)',
                backgroundColor: 'var(--surface-secondary)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
              }}>
                {item.time}
              </span>

              <h4 style={{ fontSize: '15px', color: 'var(--text-primary)' }}>
                {item.label || item.event || `Event ${idx + 1}`}
              </h4>
            </div>

            {/* Description */}
            <p style={{
              fontSize: '13.5px',
              color: 'var(--text-secondary)',
              lineHeight: '1.5',
              backgroundColor: 'var(--surface-secondary)',
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
            }}>
              {item.description || item.event}
            </p>

            {/* Suspects Involved Badges */}
            {Array.isArray(item.suspectsInvolved) && item.suspectsInvolved.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Persons present:</span>
                {item.suspectsInvolved.map((sId) => (
                  <span key={sId} className="badge badge-neutral" style={{ fontSize: '10px' }}>
                    <User size={10} />
                    {sId}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
