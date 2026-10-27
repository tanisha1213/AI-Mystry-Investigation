import React, { useState, useEffect } from 'react';
import { Search, ShieldAlert, Cpu, CheckCircle } from 'lucide-react';

const STAGES = [
  'Analyzing your narrative scenario...',
  'Constructing canonical incident background...',
  'Profiling persons of interest & suspect alibis...',
  'Generating multi-source evidence (chats, CCTV, forensics)...',
  'Auditing logical contradictions and deductive consistency...',
  'Finalizing encrypted player dossier...',
];

export default function LoadingScreen({ title = 'Synthesizing Case Dossier...' }) {
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStage((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      minHeight: '70vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      textAlign: 'center',
    }}>
      <div style={{
        position: 'relative',
        width: '90px',
        height: '90px',
        marginBottom: '32px',
      }}>
        {/* Outer glowing pulsing ring */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: '2px solid var(--accent)',
          opacity: 0.3,
          animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        }} />
        <div style={{
          position: 'absolute',
          inset: '8px',
          borderRadius: '50%',
          border: '2px dashed var(--accent)',
          animation: 'spin 8s linear infinite',
        }} />
        <div style={{
          position: 'absolute',
          inset: '16px',
          borderRadius: '50%',
          backgroundColor: 'var(--surface-secondary)',
          border: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent)',
        }}>
          <Search size={28} />
        </div>
      </div>

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes ping { 75%, 100% { transform: scale(1.6); opacity: 0; } }
      `}</style>

      <h2 style={{
        fontSize: '24px',
        marginBottom: '12px',
        color: 'var(--text-primary)',
        letterSpacing: '-0.02em',
      }}>
        {title}
      </h2>

      <p style={{
        color: 'var(--accent)',
        fontFamily: 'var(--font-mono)',
        fontSize: '13px',
        marginBottom: '36px',
        letterSpacing: '0.04em',
      }}>
        [ACTIVE ENGINE: GOOGLE GEMINI NEURAL REASONER]
      </p>

      {/* Stage indicators */}
      <div style={{
        maxWidth: '480px',
        width: '100%',
        backgroundColor: 'var(--surface-primary)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        textAlign: 'left',
      }}>
        {STAGES.map((stage, idx) => {
          const isDone = idx < currentStage;
          const isCurrent = idx === currentStage;
          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '13px',
                color: isDone ? 'var(--success)' : isCurrent ? 'var(--text-primary)' : 'var(--text-muted)',
                fontWeight: isCurrent ? 600 : 400,
              }}
            >
              {isDone ? (
                <CheckCircle size={16} color="var(--success)" />
              ) : isCurrent ? (
                <div style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  border: '2px solid var(--accent)',
                  borderTopColor: 'transparent',
                  animation: 'spin 1s linear infinite',
                }} />
              ) : (
                <div style={{
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  border: '1px solid var(--border)',
                }} />
              )}
              <span>{stage}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
