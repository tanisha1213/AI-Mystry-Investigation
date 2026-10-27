import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, X } from 'lucide-react';

export default function AccusationModal({
  isOpen,
  onClose,
  suspects = [],
  evidenceList = [],
  initialSuspectId = null,
  onSubmitAccusation,
}) {
  if (!isOpen) return null;

  const [selectedSuspectId, setSelectedSuspectId] = useState(initialSuspectId || suspects[0]?.id || '');
  const [reasoning, setReasoning] = useState('');
  const [selectedEvidenceIds, setSelectedEvidenceIds] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const toggleEvidence = (evdId) => {
    if (selectedEvidenceIds.includes(evdId)) {
      setSelectedEvidenceIds(selectedEvidenceIds.filter((id) => id !== evdId));
    } else {
      setSelectedEvidenceIds([...selectedEvidenceIds, evdId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSuspectId) {
      setError('Please select a suspect to accuse.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await onSubmitAccusation({
        suspectId: selectedSuspectId,
        reasoning,
        supportingEvidenceIds: selectedEvidenceIds,
      });
    } catch (err) {
      setError(err.message || 'Failed to submit accusation.');
      setSubmitting(false);
    }
  };

  const selectedSuspect = suspects.find((s) => s.id === selectedSuspectId);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(9, 11, 16, 0.88)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 200,
      padding: '20px',
    }}>
      <div style={{
        maxWidth: '680px',
        width: '100%',
        backgroundColor: 'var(--surface-primary)',
        border: '2px solid var(--danger)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 0 32px rgba(217, 75, 75, 0.3)',
        overflow: 'hidden',
        animation: 'modalSlide 200ms ease-out',
      }}>
        {/* Header Warning */}
        <div style={{
          backgroundColor: 'rgba(217, 75, 75, 0.15)',
          borderBottom: '1px solid rgba(217, 75, 75, 0.3)',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle size={22} color="var(--danger)" />
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: '18px',
              color: 'var(--danger)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}>
              Terminal Accusation Chamber
            </span>
          </div>

          <button
            onClick={onClose}
            disabled={submitting}
            style={{ background: 'none', color: 'var(--text-secondary)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Warning text */}
        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{
            backgroundColor: 'var(--surface-secondary)',
            borderLeft: '4px solid var(--danger)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '13px',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
          }}>
            <strong style={{ color: 'var(--text-primary)' }}>Notice to Lead Investigator: </strong>
            This is a permanent, terminal decision. You are granted exactly ONE final accusation per case. Once submitted, your deductive score will be calculated and the full canonical truth will be unlocked.
          </div>

          {error && (
            <div style={{
              backgroundColor: 'var(--danger-subtle)',
              border: '1px solid var(--danger)',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              color: 'var(--danger)',
              fontSize: '13px',
            }}>
              {error}
            </div>
          )}

          {/* Suspect selection */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Select Culprit:
            </label>
            <select
              value={selectedSuspectId}
              onChange={(e) => setSelectedSuspectId(e.target.value)}
              style={{
                fontSize: '15px',
                padding: '12px 14px',
                borderColor: 'var(--danger)',
                backgroundColor: 'var(--surface-secondary)',
              }}
            >
              {suspects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — {s.occupation} ({s.relationship})
                </option>
              ))}
            </select>
          </div>

          {selectedSuspect && (
            <div style={{
              fontSize: '12.5px',
              color: 'var(--text-muted)',
              backgroundColor: 'rgba(0,0,0,0.2)',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
            }}>
              <strong>Claimed Alibi: </strong>{selectedSuspect.publicAlibi || 'None verified'}
            </div>
          )}

          {/* Reasoning */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Investigator's Indictment & Deductive Logic:
            </label>
            <textarea
              rows={4}
              placeholder="Detail how the evidence contradicts this suspect's alibi, their opportunity window, and motive..."
              value={reasoning}
              onChange={(e) => setReasoning(e.target.value)}
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Supporting Evidence Multi-Check */}
          {evidenceList.length > 0 && (
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                Key Supporting Evidence (Select all that prove their guilt):
              </label>
              <div style={{
                maxHeight: '140px',
                overflowY: 'auto',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--surface-secondary)',
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}>
                {evidenceList.map((evd) => {
                  const checked = selectedEvidenceIds.includes(evd.id);
                  return (
                    <label
                      key={evd.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '13px',
                        cursor: 'pointer',
                        color: checked ? 'var(--accent)' : 'var(--text-secondary)',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleEvidence(evd.id)}
                        style={{ width: 'auto' }}
                      />
                      <span>[{evd.type?.toUpperCase()}] {evd.title}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Modal Footer Controls */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            borderTop: '1px solid var(--border)',
            paddingTop: '16px',
            marginTop: '8px',
          }}>
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !selectedSuspectId}
              className="btn btn-danger"
              style={{ padding: '10px 24px' }}
            >
              {submitting ? 'Verifying with Canonical Evidence...' : 'Submit Final Accusation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
