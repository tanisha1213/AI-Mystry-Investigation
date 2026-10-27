import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  apiGetCase,
  apiStartInvestigation,
  apiGetInvestigation,
  apiUpdateNotes,
  apiUpdateEvidenceBoard,
  apiMarkEvidenceReviewed,
  apiRequestHint,
  apiSubmitAccusation,
} from '../services/api';
import SuspectCard from '../components/suspects/SuspectCard';
import EvidenceCard from '../components/evidence/EvidenceCard';
import EvidenceViewer from '../components/evidence/EvidenceViewer';
import Timeline from '../components/investigation/Timeline';
import EvidenceBoard from '../components/investigation/EvidenceBoard';
import AccusationModal from '../components/investigation/AccusationModal';
import LoadingScreen from '../components/common/LoadingScreen';
import {
  Search,
  Users,
  FileText,
  Clock,
  Pin,
  ShieldAlert,
  HelpCircle,
  CheckCircle,
  Save,
  ArrowLeft,
  AlertTriangle,
  Lightbulb,
  Edit3,
} from 'lucide-react';

export default function Investigation() {
  const { caseId } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'suspects' | 'evidence' | 'timeline' | 'board'
  const [caseData, setCaseData] = useState(null);
  const [investigation, setInvestigation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals & Panels
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [isAccusationOpen, setIsAccusationOpen] = useState(false);
  const [preselectedSuspectId, setPreselectedSuspectId] = useState(null);

  // Investigator Notes
  const [notesText, setNotesText] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesSaveMsg, setNotesSaveMsg] = useState('');

  // AI Hints
  const [hintLoading, setHintLoading] = useState(false);
  const [currentHint, setCurrentHint] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        // Load case player-safe details
        const cRes = await apiGetCase(caseId);
        setCaseData(cRes.data);

        // Start or resume investigation
        const invRes = await apiStartInvestigation(caseId);
        setInvestigation(invRes.data);

        // Load existing notes if any
        if (invRes.data.notes && invRes.data.notes.length > 0) {
          setNotesText(invRes.data.notes[0].content || '');
        }

        // If investigation was already solved/completed, redirect or alert
        if (invRes.data.status === 'completed') {
          // Player already completed case, allow viewing result
        }
      } catch (err) {
        setError(err.message || 'Failed to load case investigation.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [caseId]);

  const handleOpenEvidence = async (evd) => {
    setSelectedEvidence(evd);
    // Mark as reviewed in investigation
    if (investigation && !investigation.reviewedEvidenceIds.includes(evd.id)) {
      try {
        await apiMarkEvidenceReviewed(investigation._id, evd.id);
        setInvestigation((prev) => ({
          ...prev,
          reviewedEvidenceIds: [...prev.reviewedEvidenceIds, evd.id],
        }));
      } catch {
        // non-blocking
      }
    }
  };

  const handleSaveNotes = async () => {
    if (!investigation) return;
    setSavingNotes(true);
    try {
      const notesArray = [
        {
          id: 'lead_notes',
          title: 'Primary Investigator Field Notes',
          content: notesText,
          updatedAt: new Date(),
        },
      ];
      await apiUpdateNotes(investigation._id, notesArray);
      setNotesSaveMsg('Notes saved');
      setTimeout(() => setNotesSaveMsg(''), 2000);
    } catch {
      setNotesSaveMsg('Error saving notes');
    } finally {
      setSavingNotes(false);
    }
  };

  const handleSaveBoard = async (boardData) => {
    if (!investigation) return;
    await apiUpdateEvidenceBoard(investigation._id, boardData);
    setInvestigation((prev) => ({ ...prev, evidenceBoard: boardData }));
  };

  const handlePinItem = async (item) => {
    if (!investigation) return;
    const isSuspect = Boolean(item.occupation);
    const existingCards = investigation.evidenceBoard?.cards || [];
    const alreadyPinned = existingCards.some((c) => c.refId === item.id);

    if (alreadyPinned) {
      setActiveTab('board');
      return;
    }

    const newCard = {
      id: `pin_${Date.now()}`,
      type: isSuspect ? 'suspect' : 'evidence',
      refId: item.id,
      title: item.name || item.title,
      content: isSuspect ? `${item.occupation} • ${item.relationship}` : item.description?.slice(0, 80) + '...',
      notes: '',
      color: isSuspect ? '#D94B4B' : '#D9A441',
    };

    const newBoard = {
      cards: [...existingCards, newCard],
      connections: investigation.evidenceBoard?.connections || [],
    };

    await handleSaveBoard(newBoard);
    setActiveTab('board');
  };

  const handleRequestHint = async () => {
    if (!investigation) return;
    setHintLoading(true);
    try {
      const nextLevel = Math.min((investigation.hintsUsed?.length || 0) + 1, 3);
      const res = await apiRequestHint(investigation._id, nextLevel);
      setCurrentHint(res.hintText);
      setInvestigation((prev) => ({
        ...prev,
        hintsUsed: [...(prev.hintsUsed || []), { hintLevel: res.hintLevel, hintText: res.hintText }],
      }));
    } catch (err) {
      alert(err.message);
    } finally {
      setHintLoading(false);
    }
  };

  const handleSubmitAccusation = async (accusationPayload) => {
    if (!investigation) return;
    const res = await apiSubmitAccusation(investigation._id, accusationPayload);
    setIsAccusationOpen(false);
    // Navigate to resolution screen
    navigate(`/investigation/${caseId}/result`);
  };

  if (loading) {
    return <LoadingScreen title="Decrypting Case Investigation Workspace..." />;
  }

  if (error || !caseData) {
    return (
      <div style={{ maxWidth: '800px', margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
        <AlertTriangle size={48} color="var(--danger)" style={{ marginBottom: '16px' }} />
        <h2 style={{ fontSize: '24px', color: 'var(--text-primary)', marginBottom: '10px' }}>
          Unable to Access Case File
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{error}</p>
        <button onClick={() => navigate('/create')} className="btn btn-primary">
          Create New Mystery
        </button>
      </div>
    );
  }

  const reviewedCount = investigation?.reviewedEvidenceIds?.length || 0;
  const totalEvidence = caseData.evidence?.length || 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 70px)' }}>
      {/* Top Investigation Status Bar */}
      <div style={{
        backgroundColor: 'var(--surface-primary)',
        borderBottom: '1px solid var(--border)',
        padding: '12px 24px',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={() => navigate('/history')}
            className="btn btn-secondary"
            style={{ padding: '6px 10px', fontSize: '12px' }}
            title="Return to case archive"
          >
            <ArrowLeft size={14} />
          </button>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-accent">{caseData.caseCode}</span>
              <span className="badge badge-neutral">{caseData.difficulty}</span>
              <span className="badge badge-neutral">{caseData.category}</span>
              {investigation?.status === 'completed' && (
                <span className="badge badge-success">CASE SOLVED</span>
              )}
            </div>
            <h2 style={{ fontSize: '18px', color: 'var(--text-primary)', marginTop: '2px' }}>
              {caseData.title}
            </h2>
          </div>
        </div>

        {/* Progress & Accuse CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Clues Examined:</span>
            <span style={{ fontWeight: 700, color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
              {reviewedCount} / {totalEvidence}
            </span>
          </div>

          {investigation?.status === 'completed' ? (
            <button
              onClick={() => navigate(`/investigation/${caseId}/result`)}
              className="btn btn-secondary"
              style={{ padding: '8px 18px', fontSize: '13px' }}
            >
              View Case Resolution
            </button>
          ) : (
            <button
              onClick={() => {
                setPreselectedSuspectId(null);
                setIsAccusationOpen(true);
              }}
              className="btn btn-danger"
              style={{ padding: '8px 20px', fontSize: '13px', fontWeight: 700 }}
            >
              <ShieldAlert size={16} />
              Accuse Culprit
            </button>
          )}
        </div>
      </div>

      {/* Main Multi-Panel Workspace */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '240px 1fr 320px',
        flex: 1,
        minHeight: 0,
      }}>
        {/* Left Sidebar: Navigation tabs */}
        <aside style={{
          backgroundColor: 'var(--surface-primary)',
          borderRight: '1px solid var(--border)',
          padding: '20px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}>
          <div style={{
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '6px',
            paddingLeft: '8px',
          }}>
            Investigation Sectors
          </div>

          {[
            { id: 'overview', label: 'Case Overview', icon: <Search size={16} /> },
            { id: 'suspects', label: `Persons of Interest (${caseData.suspects?.length || 0})`, icon: <Users size={16} /> },
            { id: 'evidence', label: `Evidence Clues (${caseData.evidence?.length || 0})`, icon: <FileText size={16} /> },
            { id: 'timeline', label: 'Incident Timeline', icon: <Clock size={16} /> },
            { id: 'board', label: 'Evidence Board', icon: <Pin size={16} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '13.5px',
                fontWeight: activeTab === tab.id ? 600 : 400,
                color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-secondary)',
                backgroundColor: activeTab === tab.id ? 'var(--accent-subtle)' : 'transparent',
                border: activeTab === tab.id ? '1px solid var(--accent)' : '1px solid transparent',
                textAlign: 'left',
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}

          <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', paddingLeft: '8px' }}>
              Style: <strong>{caseData.investigationStyle}</strong><br />
              Setting: <strong>{caseData.caseDetails?.location}</strong>
            </div>
          </div>
        </aside>

        {/* Center Main Workspace */}
        <main style={{
          padding: '28px',
          overflowY: 'auto',
          backgroundColor: 'var(--bg)',
        }}>
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '880px' }}>
              <div style={{
                backgroundColor: 'var(--surface-primary)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <span className="badge badge-accent">PRIMARY INCIDENT BRIEFING</span>
                    <h2 style={{ fontSize: '24px', color: 'var(--text-primary)', marginTop: '6px' }}>
                      {caseData.caseDetails?.title || caseData.title}
                    </h2>
                  </div>
                  <div className="case-stamp" style={{ fontSize: '11px' }}>
                    OPEN INVESTIGATION
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                  backgroundColor: 'var(--surface-secondary)',
                  padding: '14px 18px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  marginBottom: '20px',
                  fontSize: '13px',
                }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Setting / Location:</span>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{caseData.caseDetails?.location}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Incident Date:</span>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{caseData.caseDetails?.incidentDate || '2026-10-24'}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Classification:</span>
                    <div style={{ fontWeight: 600, color: 'var(--accent)' }}>{caseData.category}</div>
                  </div>
                </div>

                <h4 style={{ fontSize: '15px', color: 'var(--text-primary)', marginBottom: '8px' }}>
                  Incident Summary:
                </h4>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
                  {caseData.caseDetails?.incidentSummary || caseData.scenario}
                </p>

                <h4 style={{ fontSize: '15px', color: 'var(--text-primary)', marginBottom: '8px' }}>
                  Operational Background:
                </h4>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
                  {caseData.caseDetails?.background}
                </p>

                {caseData.caseDetails?.objectives && (
                  <div>
                    <h4 style={{ fontSize: '15px', color: 'var(--text-primary)', marginBottom: '10px' }}>
                      Detective Objectives:
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {caseData.caseDetails.objectives.map((obj, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: 'var(--text-primary)' }}>
                          <CheckCircle size={15} color="var(--accent)" />
                          <span>{obj}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Jump Buttons */}
              <div style={{ display: 'flex', gap: '16px' }}>
                <button onClick={() => setActiveTab('suspects')} className="btn btn-secondary" style={{ flex: 1, padding: '12px' }}>
                  <Users size={16} /> Inspect {caseData.suspects?.length} Suspects
                </button>
                <button onClick={() => setActiveTab('evidence')} className="btn btn-secondary" style={{ flex: 1, padding: '12px' }}>
                  <FileText size={16} /> Examine {caseData.evidence?.length} Evidence Items
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: SUSPECTS */}
          {activeTab === 'suspects' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h3 style={{ fontSize: '20px', color: 'var(--text-primary)' }}>
                  Persons of Interest & Suspect Profiles
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Examine claimed alibis and motives. One person among them is the canonical culprit.
                </p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
                gap: '20px',
              }}>
                {(caseData.suspects || []).map((suspect) => {
                  const isPinned = investigation?.evidenceBoard?.cards?.some((c) => c.refId === suspect.id);
                  return (
                    <SuspectCard
                      key={suspect.id}
                      suspect={suspect}
                      onPinToBoard={handlePinItem}
                      onSelectForAccusation={(s) => {
                        setPreselectedSuspectId(s.id);
                        setIsAccusationOpen(true);
                      }}
                      isPinned={isPinned}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: EVIDENCE */}
          {activeTab === 'evidence' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h3 style={{ fontSize: '20px', color: 'var(--text-primary)' }}>
                  Recovered Evidence Repository
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Review chat logs, CCTV telemetry, witness interviews, and laboratory forensics.
                </p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                gap: '20px',
              }}>
                {(caseData.evidence || []).map((evd) => {
                  const isReviewed = investigation?.reviewedEvidenceIds?.includes(evd.id);
                  const isPinned = investigation?.evidenceBoard?.cards?.some((c) => c.refId === evd.id);
                  return (
                    <EvidenceCard
                      key={evd.id}
                      evidence={evd}
                      onOpenDetail={handleOpenEvidence}
                      onPinToBoard={handlePinItem}
                      isReviewed={isReviewed}
                      isPinned={isPinned}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: TIMELINE */}
          {activeTab === 'timeline' && (
            <div style={{ maxWidth: '840px' }}>
              <Timeline timeline={caseData.timeline || []} />
            </div>
          )}

          {/* TAB 5: EVIDENCE BOARD */}
          {activeTab === 'board' && (
            <EvidenceBoard
              boardData={investigation?.evidenceBoard || { cards: [], connections: [] }}
              suspects={caseData.suspects || []}
              evidenceList={caseData.evidence || []}
              onSaveBoard={handleSaveBoard}
            />
          )}
        </main>

        {/* Right Panel: Investigation Intelligence & Notes */}
        <aside style={{
          backgroundColor: 'var(--surface-primary)',
          borderLeft: '1px solid var(--border)',
          padding: '20px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}>
          {/* Notes Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                <Edit3 size={14} color="var(--accent)" />
                <span>Investigator Notes</span>
              </div>
              <button
                onClick={handleSaveNotes}
                disabled={savingNotes}
                className="btn btn-secondary"
                style={{ fontSize: '11px', padding: '4px 8px' }}
              >
                <Save size={12} />
                {savingNotes ? 'Saving' : 'Save'}
              </button>
            </div>

            <textarea
              rows={6}
              placeholder="Record your working deductions, contradictions, and alibi checks here..."
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              style={{ fontSize: '12.5px', resize: 'vertical' }}
            />
            {notesSaveMsg && (
              <span style={{ fontSize: '11px', color: 'var(--success)' }}>{notesSaveMsg}</span>
            )}
          </div>

          {/* AI Hints Section */}
          <div style={{
            backgroundColor: 'var(--surface-secondary)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lightbulb size={16} color="var(--accent)" />
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Investigative Clue Consult
              </span>
            </div>

            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Stuck on contradictory alibis? Request progressive clues without spoiling the culprit.
            </p>

            <button
              onClick={handleRequestHint}
              disabled={hintLoading || (investigation?.hintsUsed?.length >= 3)}
              className="btn btn-outline"
              style={{ fontSize: '12px', padding: '8px 12px' }}
            >
              {hintLoading
                ? 'Consulting Crime Scene...'
                : investigation?.hintsUsed?.length >= 3
                ? 'All 3 Clues Requested'
                : `Request Clue #${(investigation?.hintsUsed?.length || 0) + 1}`}
            </button>

            {/* Display used hints */}
            {(investigation?.hintsUsed || []).length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                {investigation.hintsUsed.map((h, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: 'rgba(217, 164, 65, 0.08)',
                      borderLeft: '3px solid var(--accent)',
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '12px',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <strong>Clue {h.hintLevel}:</strong> {h.hintText}
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Evidence Viewer Modal */}
      {selectedEvidence && (
        <EvidenceViewer
          evidence={selectedEvidence}
          onClose={() => setSelectedEvidence(null)}
          onPinToBoard={handlePinItem}
          isPinned={investigation?.evidenceBoard?.cards?.some((c) => c.refId === selectedEvidence.id)}
        />
      )}

      {/* Accusation Modal */}
      {isAccusationOpen && (
        <AccusationModal
          isOpen={isAccusationOpen}
          onClose={() => setIsAccusationOpen(false)}
          suspects={caseData.suspects || []}
          evidenceList={caseData.evidence || []}
          initialSuspectId={preselectedSuspectId}
          onSubmitAccusation={handleSubmitAccusation}
        />
      )}
    </div>
  );
}
