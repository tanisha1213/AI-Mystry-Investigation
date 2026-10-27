import React from 'react';
import {
  X,
  MessageSquare,
  Video,
  Camera,
  UserCheck,
  FileText,
  MapPin,
  Clock,
  Pin,
  CheckCircle,
  AlertCircle,
  Shield,
  Download,
} from 'lucide-react';

export default function EvidenceViewer({ evidence, onClose, onPinToBoard, isPinned = false }) {
  if (!evidence) return null;

  const content = evidence.content || {};

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(9, 11, 16, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '20px',
    }}>
      <div style={{
        maxWidth: '840px',
        width: '100%',
        maxHeight: '90vh',
        backgroundColor: 'var(--surface-primary)',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg), var(--shadow-accent)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        animation: 'modalSlide 200ms ease-out',
      }}>
        <style>{`
          @keyframes modalSlide {
            from { opacity: 0; transform: translateY(12px) scale(0.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}</style>

        {/* Modal Header Bar */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid var(--border)',
          backgroundColor: 'var(--surface-secondary)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="badge badge-accent">
              {evidence.type?.toUpperCase() || 'EVIDENCE'}
            </span>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              color: 'var(--text-secondary)',
            }}>
              ID: {evidence.id || evidence.evidenceCode}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {onPinToBoard && (
              <button
                onClick={() => onPinToBoard(evidence)}
                className="btn btn-secondary"
                style={{
                  padding: '6px 12px',
                  fontSize: '12px',
                  color: isPinned ? 'var(--accent)' : 'var(--text-secondary)',
                  borderColor: isPinned ? 'var(--accent)' : 'var(--border)',
                }}
              >
                <Pin size={13} />
                {isPinned ? 'Pinned to Board' : 'Pin to Board'}
              </button>
            )}

            <button
              onClick={onClose}
              style={{
                background: 'none',
                color: 'var(--text-secondary)',
                padding: '4px',
                borderRadius: 'var(--radius-sm)',
              }}
              title="Close (Esc)"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div style={{
          padding: '24px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}>
          <div>
            <h2 style={{ fontSize: '22px', color: 'var(--text-primary)', marginBottom: '8px' }}>
              {evidence.title}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.5' }}>
              {evidence.description}
            </p>
          </div>

          {/* Specialized Renderers based on Evidence Type */}

          {/* 1. WHATSAPP / CHAT MESSAGES */}
          {evidence.type === 'message' && (
            <div style={{
              backgroundColor: '#0c1017',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderBottom: '1px solid rgba(41, 50, 65, 0.6)',
                paddingBottom: '10px',
                fontSize: '12px',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-mono)',
              }}>
                <span>RECOVERED SECURE CHAT LOG</span>
                <span>PARTICIPANTS: {content.participants ? content.participants.join(' • ') : 'Unknown'}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(content.messages || []).map((msg, idx) => {
                  const isFirstSender = idx % 2 === 0;
                  return (
                    <div
                      key={idx}
                      style={{
                        alignSelf: isFirstSender ? 'flex-start' : 'flex-end',
                        maxWidth: '75%',
                        backgroundColor: isFirstSender ? 'var(--surface-secondary)' : '#1e3a2f',
                        border: isFirstSender ? '1px solid var(--border)' : '1px solid #2d5a47',
                        borderRadius: 'var(--radius-md)',
                        padding: '10px 14px',
                      }}
                    >
                      <div style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        color: isFirstSender ? 'var(--accent)' : '#4ade80',
                        marginBottom: '3px',
                      }}>
                        {msg.sender}
                      </div>
                      <div style={{ fontSize: '13.5px', color: 'var(--text-primary)' }}>
                        {msg.text}
                      </div>
                      <div style={{
                        fontSize: '10px',
                        color: 'var(--text-muted)',
                        textAlign: 'right',
                        marginTop: '4px',
                        fontFamily: 'var(--font-mono)',
                      }}>
                        {msg.time}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. CCTV RECORD */}
          {evidence.type === 'cctv' && (
            <div style={{
              backgroundColor: '#0a0d13',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              fontFamily: 'var(--font-mono)',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--border)',
                paddingBottom: '12px',
                marginBottom: '16px',
                color: '#60A5FA',
                fontSize: '13px',
              }}>
                <div>SURVEILLANCE CAM: {content.cameraId || 'CAM-01'}</div>
                <div>ZONE: {content.location || 'Interior Corridor'}</div>
                <div>WINDOW: {content.timeRange || 'Recorded'}</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {(content.observations || []).map((obs, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      gap: '14px',
                      fontSize: '13px',
                      backgroundColor: 'rgba(24, 30, 41, 0.7)',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-sm)',
                      borderLeft: obs.event?.includes('glitch') || obs.event?.includes('freez') ? '3px solid var(--danger)' : '3px solid #60A5FA',
                    }}
                  >
                    <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{obs.time}</span>
                    <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}>{obs.event}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. FORENSIC REPORT */}
          {evidence.type === 'forensic' && (
            <div style={{
              backgroundColor: 'var(--surface-secondary)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid var(--border)',
                paddingBottom: '12px',
                marginBottom: '16px',
              }}>
                <div>
                  <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    OFFICIAL FORENSIC LABORATORY DOSSIER
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Report: {content.reportId || 'FOR-001'}
                  </div>
                </div>
                <div className="case-stamp" style={{ fontSize: '11px', padding: '2px 8px' }}>
                  VERIFIED LAB RECORD
                </div>
              </div>

              <div style={{ marginBottom: '14px', fontSize: '13px' }}>
                <strong style={{ color: 'var(--accent)' }}>Examined Apparatus / Item: </strong>
                <span style={{ color: 'var(--text-primary)' }}>{content.examinedItem || content.examinedSystem || 'Item specimen'}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Scientific Findings & Telemetry:
                </div>
                {(content.findings || []).map((find, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                      fontSize: '13.5px',
                      color: 'var(--text-primary)',
                      backgroundColor: 'rgba(0,0,0,0.25)',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    <CheckCircle size={15} color="var(--accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{find}</span>
                  </div>
                ))}
              </div>

              {content.labTechnician && (
                <div style={{
                  marginTop: '16px',
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                  textAlign: 'right',
                  fontStyle: 'italic',
                }}>
                  Certified by: {content.labTechnician}
                </div>
              )}
            </div>
          )}

          {/* 4. WITNESS STATEMENT */}
          {evidence.type === 'witness' && (
            <div style={{
              backgroundColor: 'var(--surface-secondary)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--border)',
                paddingBottom: '12px',
                marginBottom: '16px',
              }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Sworn Deposition
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {content.witnessName} ({content.witnessRole || 'Witness'})
                  </div>
                </div>
                <span className="badge badge-success">
                  {content.credibilityScore || 'Credibility High'}
                </span>
              </div>

              <blockquote style={{
                fontSize: '14px',
                fontStyle: 'italic',
                color: 'var(--text-primary)',
                lineHeight: '1.6',
                borderLeft: '3px solid var(--accent)',
                paddingLeft: '14px',
                margin: '12px 0',
              }}>
                "{content.statement}"
              </blockquote>
            </div>
          )}

          {/* 5. PHOTOGRAPH / SCENE PHOTO */}
          {evidence.type === 'photograph' && (
            <div style={{
              backgroundColor: '#0a0d13',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
            }}>
              <div style={{
                width: '100%',
                height: '240px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#121722',
                border: '1px dashed var(--border-light)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                color: 'var(--text-muted)',
                marginBottom: '16px',
                position: 'relative',
              }}>
                <Camera size={36} color="var(--accent)" />
                <div style={{ fontSize: '13px', fontFamily: 'var(--font-mono)' }}>
                  [CRIME SCENE PHOTO RECORD: {evidence.id || evidence.evidenceCode}]
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {content.caption || 'Photographic evidence captured on site'}
                </div>
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: 'var(--accent)',
                  border: '1px solid var(--accent)',
                  padding: '2px 6px',
                }}>
                  SECTOR PHOTO
                </div>
              </div>

              <div style={{ fontSize: '13.5px', color: 'var(--text-primary)', marginBottom: '12px' }}>
                <strong>Visual Analysis: </strong>{content.visualDetails}
              </div>

              {Array.isArray(content.annotations) && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {content.annotations.map((ann, i) => (
                    <div key={i} style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                      • {ann}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 6. LOCATION / ACCESS LOGS */}
          {evidence.type === 'location' && (
            <div style={{
              backgroundColor: '#0c1017',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              fontFamily: 'var(--font-mono)',
            }}>
              <div style={{
                color: '#FBBF24',
                fontSize: '13px',
                marginBottom: '14px',
                borderBottom: '1px solid var(--border)',
                paddingBottom: '8px',
              }}>
                SENSOR LOG: {content.area || 'Restricted Facility'}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(content.accessLogs || []).map((log, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '12px',
                      backgroundColor: 'rgba(24, 30, 41, 0.6)',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    <span style={{ color: 'var(--accent)' }}>{log.timestamp}</span>
                    <span style={{ color: 'var(--text-primary)' }}>{log.person}</span>
                    <span style={{ color: 'var(--success)' }}>{log.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Suspects Tags */}
          {evidence.relatedSuspectIds && evidence.relatedSuspectIds.length > 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              borderTop: '1px solid var(--border)',
              paddingTop: '16px',
              fontSize: '13px',
            }}>
              <span style={{ color: 'var(--text-muted)' }}>Cross-referenced Persons:</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                {evidence.relatedSuspectIds.map((sId) => (
                  <span key={sId} className="badge badge-neutral">
                    {sId}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '14px 24px',
          borderTop: '1px solid var(--border)',
          backgroundColor: 'var(--surface-secondary)',
          display: 'flex',
          justifyContent: 'flex-end',
        }}>
          <button onClick={onClose} className="btn btn-secondary">
            Close Record
          </button>
        </div>
      </div>
    </div>
  );
}
