import React from 'react';
import {
  MessageSquare,
  Video,
  Camera,
  UserCheck,
  FileText,
  MapPin,
  Clock,
  Pin,
  CheckCircle,
  Eye,
} from 'lucide-react';

export default function EvidenceCard({
  evidence,
  onOpenDetail,
  onPinToBoard,
  isReviewed = false,
  isPinned = false,
}) {
  if (!evidence) return null;

  const getTypeIcon = (type) => {
    switch (type) {
      case 'message':
        return <MessageSquare size={16} color="var(--accent)" />;
      case 'cctv':
        return <Video size={16} color="#60A5FA" />;
      case 'photograph':
        return <Camera size={16} color="#F472B6" />;
      case 'witness':
        return <UserCheck size={16} color="#34D399" />;
      case 'forensic':
        return <FileText size={16} color="#A78BFA" />;
      case 'location':
        return <MapPin size={16} color="#FBBF24" />;
      default:
        return <FileText size={16} color="var(--accent)" />;
    }
  };

  const getTypeBadgeClass = (type) => {
    switch (type) {
      case 'cctv':
        return 'badge-info';
      case 'witness':
        return 'badge-success';
      case 'forensic':
        return 'badge-accent';
      default:
        return 'badge-neutral';
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--surface-primary)',
        border: isReviewed ? '1px solid var(--border-light)' : '1px solid var(--accent)',
        borderRadius: 'var(--radius-lg)',
        padding: '18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        position: 'relative',
        transition: 'all var(--transition-fast)',
        boxShadow: isReviewed ? 'var(--shadow-sm)' : '0 0 16px rgba(217, 164, 65, 0.08)',
      }}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--surface-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {getTypeIcon(evidence.type)}
          </div>
          <span className={`badge ${getTypeBadgeClass(evidence.type)}`}>
            {evidence.type || 'Evidence'}
          </span>
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            {evidence.id || evidence.evidenceCode}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isReviewed && (
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              color: 'var(--success)',
              fontFamily: 'var(--font-mono)',
            }}>
              <CheckCircle size={13} />
              EXAMINED
            </span>
          )}

          {onPinToBoard && (
            <button
              onClick={() => onPinToBoard(evidence)}
              className="btn btn-secondary"
              style={{
                padding: '4px 8px',
                fontSize: '11px',
                color: isPinned ? 'var(--accent)' : 'var(--text-secondary)',
              }}
              title="Pin to Evidence Board"
            >
              <Pin size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Title & Description */}
      <div>
        <h4 style={{
          fontSize: '16px',
          color: 'var(--text-primary)',
          marginBottom: '6px',
        }}>
          {evidence.title}
        </h4>
        <p style={{
          fontSize: '13px',
          color: 'var(--text-secondary)',
          lineHeight: '1.45',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {evidence.description}
        </p>
      </div>

      {/* Timestamp & Cross-references */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
        borderTop: '1px solid var(--border)',
        paddingTop: '12px',
        fontSize: '12px',
        color: 'var(--text-muted)',
      }}>
        {evidence.timestamp ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Clock size={13} />
            <span>{new Date(evidence.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        ) : (
          <span />
        )}

        <button
          onClick={() => onOpenDetail(evidence)}
          className="btn btn-secondary"
          style={{ padding: '6px 12px', fontSize: '12px' }}
        >
          <Eye size={13} />
          Examine Record
        </button>
      </div>
    </div>
  );
}
