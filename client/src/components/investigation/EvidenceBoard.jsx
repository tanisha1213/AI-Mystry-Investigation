import React, { useState } from 'react';
import { Pin, Trash2, Plus, Link as LinkIcon, Save, Tag } from 'lucide-react';

export default function EvidenceBoard({
  boardData = { cards: [], connections: [] },
  suspects = [],
  evidenceList = [],
  onSaveBoard,
}) {
  const [cards, setCards] = useState(boardData.cards || []);
  const [connections, setConnections] = useState(boardData.connections || []);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [selectedType, setSelectedType] = useState('suspect');
  const [selectedRefId, setSelectedRefId] = useState('');
  const [customNoteText, setCustomNoteText] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Link state
  const [linkFrom, setLinkFrom] = useState('');
  const [linkTo, setLinkTo] = useState('');
  const [linkLabel, setLinkLabel] = useState('');

  const handleAddCard = () => {
    let title = '';
    let content = '';

    if (selectedType === 'suspect') {
      const sus = suspects.find((s) => s.id === selectedRefId);
      if (!sus) return;
      title = sus.name;
      content = `${sus.occupation} • ${sus.relationship}`;
    } else if (selectedType === 'evidence') {
      const evd = evidenceList.find((e) => e.id === selectedRefId);
      if (!evd) return;
      title = evd.title;
      content = evd.description?.slice(0, 80) + '...';
    } else {
      if (!customNoteText.trim()) return;
      title = 'Deductive Note';
      content = customNoteText;
    }

    const newCard = {
      id: `board_c_${Date.now()}`,
      type: selectedType,
      refId: selectedRefId || null,
      title,
      content,
      notes: '',
      color: selectedType === 'suspect' ? '#D94B4B' : selectedType === 'evidence' ? '#D9A441' : '#3B82F6',
    };

    const updatedCards = [...cards, newCard];
    setCards(updatedCards);
    setIsAddingCard(false);
    setCustomNoteText('');
    setSelectedRefId('');
  };

  const handleRemoveCard = (cardId) => {
    setCards(cards.filter((c) => c.id !== cardId));
    setConnections(connections.filter((con) => con.fromId !== cardId && con.toId !== cardId));
  };

  const handleAddConnection = () => {
    if (!linkFrom || !linkTo || linkFrom === linkTo) return;
    const newConn = {
      id: `con_${Date.now()}`,
      fromId: linkFrom,
      toId: linkTo,
      label: linkLabel || 'Suspicious Connection',
      color: '#D9A441',
    };
    setConnections([...connections, newConn]);
    setLinkFrom('');
    setLinkTo('');
    setLinkLabel('');
  };

  const handleRemoveConnection = (connId) => {
    setConnections(connections.filter((c) => c.id !== connId));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSaveBoard({ cards, connections });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch {
      // handled by parent
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      backgroundColor: 'var(--surface-primary)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border)',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    }}>
      {/* Top Header & Actions */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '12px',
        borderBottom: '1px solid var(--border)',
        paddingBottom: '14px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Pin size={20} color="var(--accent)" />
          <div>
            <h3 style={{ fontSize: '18px', color: 'var(--text-primary)' }}>
              Interactive Evidence & Theory Board
            </h3>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Pin persons of interest, link contradictory clues, and save your deduction network.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setIsAddingCard(!isAddingCard)}
            className="btn btn-secondary"
            style={{ fontSize: '12px', padding: '6px 12px' }}
          >
            <Plus size={14} />
            Pin New Item
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="btn btn-primary"
            style={{ fontSize: '12px', padding: '6px 14px' }}
          >
            <Save size={14} />
            {saving ? 'Saving...' : savedSuccess ? 'Board Saved!' : 'Save Board'}
          </button>
        </div>
      </div>

      {/* Add Card Modal / Drawer */}
      {isAddingCard && (
        <div style={{
          backgroundColor: 'var(--surface-secondary)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent)' }}>
            PIN AN ITEM TO THE EVIDENCE BOARD
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setSelectedRefId('');
              }}
              style={{ maxWidth: '180px' }}
            >
              <option value="suspect">Suspect / POI</option>
              <option value="evidence">Evidence Clue</option>
              <option value="custom_note">Custom Investigator Note</option>
            </select>

            {selectedType === 'suspect' && (
              <select
                value={selectedRefId}
                onChange={(e) => setSelectedRefId(e.target.value)}
                style={{ flex: 1 }}
              >
                <option value="">-- Choose Suspect to Pin --</option>
                {suspects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.occupation})
                  </option>
                ))}
              </select>
            )}

            {selectedType === 'evidence' && (
              <select
                value={selectedRefId}
                onChange={(e) => setSelectedRefId(e.target.value)}
                style={{ flex: 1 }}
              >
                <option value="">-- Choose Evidence to Pin --</option>
                {evidenceList.map((e) => (
                  <option key={e.id} value={e.id}>
                    [{e.type.toUpperCase()}] {e.title}
                  </option>
                ))}
              </select>
            )}

            {selectedType === 'custom_note' && (
              <input
                type="text"
                placeholder="Write deductive theory or connection note..."
                value={customNoteText}
                onChange={(e) => setCustomNoteText(e.target.value)}
                style={{ flex: 1 }}
              />
            )}

            <button onClick={handleAddCard} className="btn btn-primary" style={{ padding: '6px 14px' }}>
              Confirm Pin
            </button>
            <button onClick={() => setIsAddingCard(false)} className="btn btn-secondary" style={{ padding: '6px 10px' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Board Canvas Area */}
      {cards.length === 0 ? (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          backgroundColor: 'var(--surface-secondary)',
          borderRadius: 'var(--radius-md)',
          border: '1px dashed var(--border)',
          color: 'var(--text-muted)',
        }}>
          Your evidence board is empty. Click "+ Pin New Item" or pin directly from Suspect profiles & Evidence records!
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '16px',
        }}>
          {cards.map((card) => (
            <div
              key={card.id}
              style={{
                backgroundColor: 'var(--surface-secondary)',
                border: `1px solid ${card.color || 'var(--border)'}`,
                borderTop: `4px solid ${card.color || 'var(--accent)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                position: 'relative',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge" style={{ backgroundColor: 'rgba(0,0,0,0.3)', color: card.color }}>
                  {card.type.toUpperCase()}
                </span>
                <button
                  onClick={() => handleRemoveCard(card.id)}
                  style={{ background: 'none', color: 'var(--text-muted)' }}
                  title="Remove from board"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <h4 style={{ fontSize: '15px', color: 'var(--text-primary)' }}>
                {card.title}
              </h4>
              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                {card.content}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Theory Connections Section */}
      {cards.length >= 2 && (
        <div style={{
          borderTop: '1px solid var(--border)',
          paddingTop: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <LinkIcon size={14} color="var(--accent)" />
            DEDUCTIVE CONNECTION THREADS
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <select
              value={linkFrom}
              onChange={(e) => setLinkFrom(e.target.value)}
              style={{ maxWidth: '200px' }}
            >
              <option value="">-- From Card --</option>
              {cards.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>

            <select
              value={linkTo}
              onChange={(e) => setLinkTo(e.target.value)}
              style={{ maxWidth: '200px' }}
            >
              <option value="">-- To Card --</option>
              {cards.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Hypothesis / Relationship (e.g. Alibi contradicts CCTV)"
              value={linkLabel}
              onChange={(e) => setLinkLabel(e.target.value)}
              style={{ flex: 1, minWidth: '220px' }}
            />

            <button
              onClick={handleAddConnection}
              className="btn btn-secondary"
              style={{ fontSize: '12px', padding: '6px 12px' }}
            >
              Add Link
            </button>
          </div>

          {connections.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
              {connections.map((conn) => {
                const fromCard = cards.find((c) => c.id === conn.fromId);
                const toCard = cards.find((c) => c.id === conn.toId);
                return (
                  <div
                    key={conn.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: 'rgba(217, 164, 65, 0.08)',
                      border: '1px solid rgba(217, 164, 65, 0.25)',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '12px',
                    }}
                  >
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                      {fromCard?.title || 'Card'}
                    </span>
                    <span style={{ color: 'var(--accent)' }}>&rarr;</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                      {toCard?.title || 'Card'}
                    </span>
                    <span style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                      ({conn.label})
                    </span>
                    <button
                      onClick={() => handleRemoveConnection(conn.id)}
                      style={{ background: 'none', color: 'var(--text-muted)', marginLeft: '4px' }}
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
