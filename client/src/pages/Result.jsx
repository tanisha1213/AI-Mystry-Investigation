import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiGetInvestigation, apiGetSolution, apiStartInvestigation } from '../services/api';
import LoadingScreen from '../components/common/LoadingScreen';
import confetti from 'canvas-confetti';
import {
  CheckCircle,
  XCircle,
  Award,
  Clock,
  Key,
  Shield,
  UserX,
  FileText,
  RotateCcw,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';

export default function Result() {
  const { caseId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [solutionData, setSolutionData] = useState(null);
  const [investigation, setInvestigation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadSolution() {
      try {
        setLoading(true);
        // First retrieve investigation by caseId
        const invRes = await apiGetInvestigation(caseId).catch(async () => {
          // If caseId is passed in URL, we query investigation endpoint
          return null;
        });

        // Try getting solution directly using caseId or active investigation
        // Note: the backend solution endpoint is /investigations/:investigationId/solution
        // Let's resolve the investigationId
        let invId = caseId;
        try {
          const checkInv = await apiGetInvestigation(caseId);
          invId = checkInv.data._id;
          setInvestigation(checkInv.data);
        } catch {
          // If caseId is mysteryCase._id, start/find investigation to get ID
          const startRes = await apiStartInvestigation(caseId);
          invId = startRes.data._id;
          setInvestigation(startRes.data);
        }

        const solRes = await apiGetSolution(invId);
        setSolutionData(solRes.solution);

        // If player was correct, trigger confetti celebration
        if (solRes.solution.isPlayerCorrect) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      } catch (err) {
        setError(err.message || 'Unable to load canonical solution.');
      } finally {
        setLoading(false);
      }
    }
    loadSolution();
  }, [caseId]);

  if (loading) {
    return <LoadingScreen title="Unsealing Canonical Case Solution..." />;
  }

  if (error || !solutionData) {
    return (
      <div style={{ maxWidth: '700px', margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
        <AlertTriangle size={48} color="var(--danger)" style={{ marginBottom: '16px' }} />
        <h2 style={{ fontSize: '24px', color: 'var(--text-primary)', marginBottom: '12px' }}>
          Solution Sealed
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          {error || 'The canonical solution is only unsealed once an accusation has been formally submitted.'}
        </p>
        <button onClick={() => navigate(`/investigation/${caseId}`)} className="btn btn-primary">
          Return to Investigation
        </button>
      </div>
    );
  }

  const isCorrect = solutionData.isPlayerCorrect;
  const culprit = solutionData.culprit;

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '40px 24px 80px' }}>
      {/* Top Result Banner */}
      <div style={{
        backgroundColor: isCorrect ? 'rgba(66, 184, 131, 0.12)' : 'rgba(217, 75, 75, 0.12)',
        border: isCorrect ? '2px solid var(--success)' : '2px solid var(--danger)',
        borderRadius: 'var(--radius-lg)',
        padding: '32px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '36px',
        boxShadow: isCorrect ? '0 0 30px rgba(66, 184, 131, 0.2)' : '0 0 30px rgba(217, 75, 75, 0.2)',
      }}>
        {isCorrect ? (
          <CheckCircle size={56} color="var(--success)" />
        ) : (
          <XCircle size={56} color="var(--danger)" />
        )}

        <div>
          <div className="case-stamp" style={{
            borderColor: isCorrect ? 'var(--success)' : 'var(--danger)',
            color: isCorrect ? 'var(--success)' : 'var(--danger)',
            marginBottom: '12px',
          }}>
            {isCorrect ? 'CASE SOLVED // ACCUSATION VERIFIED' : 'CASE CLOSED // INCORRECT ACCUSATION'}
          </div>

          <h1 style={{ fontSize: '32px', color: 'var(--text-primary)', marginBottom: '6px' }}>
            {isCorrect ? 'Outstanding Deduction, Detective!' : 'The Evidence Contradicts Your Accusation'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', maxWidth: '640px' }}>
            {isCorrect
              ? 'Your accusation matched the canonical facts. The culprit has been unequivocally unmasked.'
              : 'Your chosen suspect was innocent. Review the canonical findings below to discover where your theory deviated.'}
          </p>
        </div>

        {/* Score Card */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          backgroundColor: 'var(--surface-primary)',
          border: '1px solid var(--border)',
          padding: '10px 24px',
          borderRadius: 'var(--radius-full)',
        }}>
          <Award size={20} color="var(--accent)" />
          <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Deductive Score:
          </span>
          <span style={{
            fontSize: '20px',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            color: 'var(--accent)',
          }}>
            {solutionData.score || (isCorrect ? 1000 : 150)} PTS
          </span>
        </div>
      </div>

      {/* Main Canonical Solution Breakdown */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {/* The Canonical Culprit Reveal */}
        <div style={{
          backgroundColor: 'var(--surface-primary)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '28px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Key size={22} color="var(--accent)" />
            <h2 style={{ fontSize: '22px', color: 'var(--text-primary)' }}>
              The True Canonical Culprit
            </h2>
          </div>

          <div style={{
            backgroundColor: 'var(--surface-secondary)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '20px', color: 'var(--danger)' }}>
                  {culprit.name}
                </h3>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  {culprit.occupation}
                </div>
              </div>
              <span className="badge badge-danger">PROVEN PERPETRATOR</span>
            </div>

            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {culprit.profileDescription}
            </div>

            <div style={{
              backgroundColor: 'rgba(217, 164, 65, 0.08)',
              borderLeft: '4px solid var(--accent)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              marginTop: '8px',
            }}>
              <strong style={{ color: 'var(--accent)', display: 'block', marginBottom: '4px' }}>
                True Motive:
              </strong>
              <span style={{ color: 'var(--text-primary)', fontSize: '14px' }}>
                {solutionData.motive}
              </span>
            </div>

            <div style={{
              backgroundColor: 'rgba(217, 75, 75, 0.08)',
              borderLeft: '4px solid var(--danger)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
            }}>
              <strong style={{ color: 'var(--danger)', display: 'block', marginBottom: '4px' }}>
                How the Crime was Carried Out (Method):
              </strong>
              <span style={{ color: 'var(--text-primary)', fontSize: '14px' }}>
                {solutionData.method}
              </span>
            </div>
          </div>
        </div>

        {/* Master Explanation */}
        <div style={{
          backgroundColor: 'var(--surface-primary)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '28px',
        }}>
          <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '14px' }}>
            Comprehensive Detective Explanation
          </h3>
          <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            {solutionData.explanation}
          </p>
        </div>

        {/* Key Clues That Proved It */}
        {solutionData.keyClues && solutionData.keyClues.length > 0 && (
          <div style={{
            backgroundColor: 'var(--surface-primary)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '28px',
          }}>
            <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '16px' }}>
              The Definitive Evidence Chain
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {solutionData.keyClues.map((clue, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    backgroundColor: 'var(--surface-secondary)',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '14px',
                    color: 'var(--text-primary)',
                  }}
                >
                  <CheckCircle size={18} color="var(--accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{clue}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Why Innocent Suspects Were Eliminated */}
        {solutionData.innocentSuspectExplanations && solutionData.innocentSuspectExplanations.length > 0 && (
          <div style={{
            backgroundColor: 'var(--surface-primary)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '28px',
          }}>
            <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserX size={18} color="var(--success)" />
              Why Other Suspects Were Exonerated
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {solutionData.innocentSuspectExplanations.map((innocent, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: 'var(--surface-secondary)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '14px 18px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <span style={{ fontWeight: 600, color: 'var(--accent)', fontSize: '13px' }}>
                    Suspect: {innocent.suspectId}
                  </span>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {innocent.whyEliminated}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Player's Own Indictment Log */}
        {solutionData.playerAccusation && solutionData.playerAccusation.reasoning && (
          <div style={{
            backgroundColor: 'var(--surface-primary)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
          }}>
            <h4 style={{ fontSize: '15px', color: 'var(--text-primary)', marginBottom: '8px' }}>
              Your Submitted Indictment Argument:
            </h4>
            <blockquote style={{
              fontStyle: 'italic',
              color: 'var(--text-secondary)',
              borderLeft: '3px solid var(--border-light)',
              paddingLeft: '14px',
              fontSize: '13.5px',
            }}>
              "{solutionData.playerAccusation.reasoning}"
            </blockquote>
          </div>
        )}

        {/* Action Controls */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          marginTop: '20px',
        }}>
          <Link to={`/investigation/${caseId}`} className="btn btn-secondary" style={{ padding: '12px 24px' }}>
            Review Investigation Room
          </Link>
          <Link to="/create" className="btn btn-primary" style={{ padding: '12px 28px' }}>
            Investigate Another Mystery &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
