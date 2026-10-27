import React from 'react';
import { Shield, Sparkles, Scale } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      backgroundColor: 'var(--surface-primary)',
      padding: '40px 24px 30px',
      marginTop: 'auto',
    }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        {/* Fictional Disclaimer Banner - Section 12.5 Requirement */}
        <div style={{
          backgroundColor: 'rgba(217, 164, 65, 0.06)',
          border: '1px solid rgba(217, 164, 65, 0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          marginBottom: '32px',
        }}>
          <Shield size={22} color="var(--accent)" style={{ flexShrink: 0 }} />
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            <strong style={{ color: 'var(--accent)' }}>Mandatory Entertainment Disclaimer:</strong> All cases, suspects, messages, CCTV transcripts, forensic reports, and evidence in AI Mystery Room are completely fictional and generated for interactive gaming and logical reasoning entertainment. The application does not integrate with real-world law enforcement or authentic communication networks.
          </p>
        </div>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20px',
          borderTop: '1px solid var(--border)',
          paddingTop: '24px',
          color: 'var(--text-muted)',
          fontSize: '13px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Scale size={16} color="var(--accent)" />
            <span>AI Mystery Room &copy; {new Date().getFullYear()} — Powered by Google Gemini AI & SDD Architecture</span>
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <span>Single Source of Truth v1.0.0</span>
            <span>•</span>
            <span>Zero-Leakage Canonical Security</span>
            <span>•</span>
            <span>Deterministic Deductive Gameplay</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
