import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCreateCase } from '../services/api';
import LoadingScreen from '../components/common/LoadingScreen';
import {
  Search,
  Sparkles,
  AlertCircle,
  Shield,
  Layers,
  BookOpen,
  Sliders,
  Check,
} from 'lucide-react';

const SAMPLE_SCENARIOS = [
  {
    title: 'Private Art Gallery Heist',
    category: 'Theft',
    text: 'An irreplaceable Renaissance oil painting vanished from a private vault during a stormy evening. Four employees were on shift, and the corridor CCTV looped static for nine critical minutes.',
  },
  {
    title: 'Penthouse Poisoning',
    category: 'Murder Mystery',
    text: 'A tech tycoon collapsed at his 50th-floor penthouse dinner. Only four close business associates were present, and an encrypted keycard was used to access the executive study right before dessert.',
  },
  {
    title: 'Quantum Lab Cyber Breach',
    category: 'Cybercrime',
    text: 'A secret cryptographic prototype algorithm was wiped from the air-gapped laboratory terminal. Security access records show four research directors logged badge swipes around midnight.',
  },
];

const EVIDENCE_OPTIONS = [
  'Messages',
  'CCTV',
  'Witness Statements',
  'Forensic Reports',
  'Photographs',
  'Documents',
  'Location Records',
];

export default function CreateMystery() {
  const navigate = useNavigate();

  const [scenario, setScenario] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [category, setCategory] = useState('Theft');
  const [investigationStyle, setInvestigationStyle] = useState('Realistic');
  const [evidenceTypes, setEvidenceTypes] = useState(['Messages', 'CCTV', 'Witness Statements', 'Forensic Reports']);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleEvidenceType = (type) => {
    if (evidenceTypes.includes(type)) {
      if (evidenceTypes.length <= 3) {
        setError('At least three evidence categories must be selected.');
        return;
      }
      setEvidenceTypes(evidenceTypes.filter((t) => t !== type));
    } else {
      setEvidenceTypes([...evidenceTypes, type]);
    }
    setError(null);
  };

  const handleApplySample = (sample) => {
    setScenario(sample.text);
    setCategory(sample.category);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!scenario || scenario.trim().length < 30) {
      setError('Scenario must be at least 30 characters long.');
      return;
    }
    if (scenario.trim().length > 3000) {
      setError('Scenario cannot exceed 3000 characters.');
      return;
    }
    if (evidenceTypes.length < 3) {
      setError('Please select at least three evidence types.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await apiCreateCase({
        scenario: scenario.trim(),
        difficulty,
        category,
        investigationStyle,
        evidenceTypes,
      });

      // Navigate straight to the new investigation room
      navigate(`/investigation/${res.caseId}`);
    } catch (err) {
      setError(err.message || 'Failed to synthesize mystery case. Please try again.');
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen title="Constructing Canonical Investigation Dossier..." />;
  }

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '40px 24px 80px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div className="case-stamp" style={{ marginBottom: '10px' }}>
          NEW CASE FILE DRAFT
        </div>
        <h1 style={{ fontSize: '36px', color: 'var(--text-primary)', marginBottom: '8px' }}>
          Create an Investigation
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
          Describe a scenario, mystery premise, or crime. Google Gemini will engineer a fully solvable canonical case with evidence, suspects, and hidden clues.
        </p>
      </div>

      {error && (
        <div style={{
          backgroundColor: 'var(--danger-subtle)',
          border: '1px solid var(--danger)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: 'var(--danger)',
          marginBottom: '24px',
          fontSize: '14px',
        }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Quick Inspiration Presets */}
      <div style={{ marginBottom: '28px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '10px' }}>
          Quick Inspiration Scenarios (Click to Load):
        </label>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '12px',
        }}>
          {SAMPLE_SCENARIOS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplySample(sample)}
              style={{
                backgroundColor: 'var(--surface-primary)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 14px',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
              className="btn-secondary"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, color: 'var(--accent)', fontSize: '13px' }}>
                  {sample.title}
                </span>
                <span className="badge badge-neutral" style={{ fontSize: '10px' }}>
                  {sample.category}
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                {sample.text.slice(0, 85)}...
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Creation Form */}
      <form onSubmit={handleSubmit} style={{
        backgroundColor: 'var(--surface-primary)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}>
        {/* Scenario Input */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Crime / Mysterious Incident Scenario *
            </label>
            <span style={{ fontSize: '12px', color: scenario.length < 30 ? 'var(--danger)' : 'var(--text-muted)' }}>
              {scenario.length} / 3000 chars (min 30)
            </span>
          </div>
          <textarea
            rows={5}
            placeholder="Describe the incident, location, persons present, missing objects, or suspicious circumstances..."
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
            style={{ fontSize: '14px', lineHeight: 1.5 }}
          />
        </div>

        {/* Configuration Row 1: Category & Difficulty */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
        }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Mystery Category
            </label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="Theft">Theft</option>
              <option value="Murder Mystery">Murder Mystery</option>
              <option value="Disappearance">Disappearance</option>
              <option value="Corporate Espionage">Corporate Espionage</option>
              <option value="Cybercrime">Cybercrime</option>
              <option value="Suspicious Incident">Suspicious Incident</option>
              <option value="Custom">Custom</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Deductive Difficulty
            </label>
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="Easy">Easy (3 Suspects • Direct Clues)</option>
              <option value="Medium">Medium (4-5 Suspects • Contradictions)</option>
              <option value="Hard">Hard (5-6 Suspects • Overlapping Alibis)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Atmospheric Style
            </label>
            <select value={investigationStyle} onChange={(e) => setInvestigationStyle(e.target.value)}>
              <option value="Realistic">Realistic Forensics</option>
              <option value="Cinematic">Cinematic Noir</option>
              <option value="Psychological">Psychological Thriller</option>
              <option value="Classic Detective">Classic Whodunit</option>
            </select>
          </div>
        </div>

        {/* Evidence Multi-select */}
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
            Evidence Types to Synthesize (Select at least 3)
          </label>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
          }}>
            {EVIDENCE_OPTIONS.map((type) => {
              const selected = evidenceTypes.includes(type);
              return (
                <button
                  type="button"
                  key={type}
                  onClick={() => toggleEvidenceType(type)}
                  style={{
                    backgroundColor: selected ? 'var(--accent-subtle)' : 'var(--surface-secondary)',
                    color: selected ? 'var(--accent)' : 'var(--text-secondary)',
                    border: selected ? '1px solid var(--accent)' : '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '8px 14px',
                    fontSize: '13px',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  {selected && <Check size={14} />}
                  <span>{type}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit */}
        <div style={{
          borderTop: '1px solid var(--border)',
          paddingTop: '20px',
          display: 'flex',
          justifyContent: 'flex-end',
        }}>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ padding: '14px 32px', fontSize: '15px' }}
          >
            <Search size={18} />
            Generate Investigation Dossier
          </button>
        </div>
      </form>
    </div>
  );
}
