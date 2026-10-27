import React from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  ShieldAlert,
  FileText,
  UserCheck,
  Video,
  Award,
  ArrowRight,
  Brain,
  Lock,
  Compass,
} from 'lucide-react';

export default function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '80px', paddingBottom: '60px' }}>
      {/* Hero Section */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '80px 24px 40px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        position: 'relative',
      }}>
        {/* Radar Sweep Effect in Background */}
        <div className="case-stamp" style={{ marginBottom: '8px' }}>
          CLASSIFIED INVESTIGATION TERMINAL
        </div>

        <h1 style={{
          fontSize: 'clamp(38px, 6vw, 68px)',
          fontWeight: 700,
          lineHeight: 1.1,
          maxWidth: '900px',
          color: 'var(--text-primary)',
        }}>
          Every Story Hides a <span style={{ color: 'var(--accent)' }}>Secret.</span>
        </h1>

        <p style={{
          fontSize: 'clamp(16px, 2vw, 20px)',
          color: 'var(--text-secondary)',
          maxWidth: '680px',
          lineHeight: 1.6,
        }}>
          Create a mystery. Investigate multi-source digital and physical evidence. Cross-examine suspect alibis. Unmask the canonical culprit.
        </p>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '12px' }}>
          <Link to="/create" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '15px' }}>
            <Search size={18} />
            Create Your Mystery
          </Link>
          <a href="#how-it-works" className="btn btn-secondary" style={{ padding: '14px 28px', fontSize: '15px' }}>
            <Compass size={18} />
            Explore How It Works
          </a>
        </div>

        {/* Cinematic Fictional Case Interactive Preview (Section 5.2) */}
        <div style={{
          marginTop: '40px',
          maxWidth: '980px',
          width: '100%',
          backgroundColor: 'var(--surface-primary)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg), var(--shadow-accent)',
          padding: '24px',
          textAlign: 'left',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Top Preview Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--border)',
            paddingBottom: '14px',
            marginBottom: '18px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="badge badge-accent">ACTIVE DOSSIER PREVIEW</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>
                CASE-2026-9042
              </span>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--success)', fontFamily: 'var(--font-mono)' }}>
              ● LOGICALLY SOLVABLE (0% RANDOM)
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {/* Left overview */}
            <div>
              <h3 style={{ fontSize: '20px', color: 'var(--text-primary)', marginBottom: '8px' }}>
                The Midnight Vault Breach at Vanguard Gallery
              </h3>
              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                At 20:47, an electronic lock override opened the high-security archive during a scheduled 9-minute CCTV outage. Four senior keyholders were present on site with conflicting electronic alibis.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <span className="badge badge-neutral">4 Suspects</span>
                <span className="badge badge-neutral">8 Clues</span>
                <span className="badge badge-neutral">CCTV Telemetry</span>
                <span className="badge badge-neutral">Digital Forensics</span>
              </div>
            </div>

            {/* Right blurred culprit reveal preview */}
            <div style={{
              backgroundColor: 'var(--surface-secondary)',
              border: '1px dashed var(--border-light)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                backdropFilter: 'blur(6px)',
                backgroundColor: 'rgba(17, 21, 29, 0.75)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                borderRadius: 'var(--radius-md)',
                zIndex: 2,
              }}>
                <Lock size={28} color="var(--accent)" />
                <span style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 600,
                  fontSize: '14px',
                  color: 'var(--text-primary)',
                }}>
                  CANONICAL CULPRIT ENCRYPTED
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Unlocks only upon formal investigator indictment
                </span>
              </div>

              <div style={{ filter: 'blur(3px)', opacity: 0.6, fontSize: '12px' }}>
                <strong>Culprit:</strong> Julian Sterling (Head of Security)<br />
                <strong>Motive:</strong> Impending audit evasion & debt liquidation<br />
                <strong>Method:</strong> Scheduled manual loop on CAM-SEC-04 using administrative desk controls
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works (Section 5.2) */}
      <section id="how-it-works" style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '32px', marginBottom: '12px' }}>
            How The Investigation Works
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
            Your imagination creates the mystery. Your intelligence solves it.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px',
        }}>
          {[
            {
              step: '01',
              title: 'Tell Your Story',
              desc: 'Enter any prompt, premise, or scenario — from stolen art to closed-room penthouse murders.',
              icon: <FileText size={24} color="var(--accent)" />,
            },
            {
              step: '02',
              title: 'Discover Evidence',
              desc: 'Inspect fictional encrypted chats, CCTV surveillance logs, footwear forensics, and witness statements.',
              icon: <Video size={24} color="#60A5FA" />,
            },
            {
              step: '03',
              title: 'Cross-Examine Alibis',
              desc: 'Pin suspects to your evidence board, link contradictory timestamps, and eliminate innocent parties.',
              icon: <UserCheck size={24} color="#34D399" />,
            },
            {
              step: '04',
              title: 'Unmask the Culprit',
              desc: 'Submit your final indictment. The backend reveals the canonical solution and scores your deductive logic.',
              icon: <Award size={24} color="var(--accent)" />,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'var(--surface-primary)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                position: 'relative',
              }}
            >
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                fontWeight: 700,
                color: 'var(--accent)',
              }}>
                PHASE // {item.step}
              </div>
              <div style={{ margin: '4px 0' }}>{item.icon}</div>
              <h3 style={{ fontSize: '18px', color: 'var(--text-primary)' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '30px', marginBottom: '10px' }}>
            Built for Pure Logical Deductive Reasoning
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            No random culprits. No illogical twists. Every case is grounded in canonical truth.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
        }}>
          <div style={{
            backgroundColor: 'var(--surface-primary)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
          }}>
            <Brain size={24} color="var(--accent)" style={{ marginBottom: '12px' }} />
            <h4 style={{ fontSize: '17px', marginBottom: '8px' }}>Google Gemini Reasoner</h4>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Synthesizes coherent, multi-party narratives with interlocking alibis, motives, and physical/digital evidence.
            </p>
          </div>

          <div style={{
            backgroundColor: 'var(--surface-primary)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
          }}>
            <Lock size={24} color="var(--danger)" style={{ marginBottom: '12px' }} />
            <h4 style={{ fontSize: '17px', marginBottom: '8px' }}>Zero-Leakage Architecture</h4>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              The culprit identity and canonical solution are cryptographically sealed in backend storage and never sent to browser network tools before indictment.
            </p>
          </div>

          <div style={{
            backgroundColor: 'var(--surface-primary)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
          }}>
            <Award size={24} color="var(--success)" style={{ marginBottom: '12px' }} />
            <h4 style={{ fontSize: '17px', marginBottom: '8px' }}>Tactical Detective Board</h4>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Pin suspect cards, draw connection threads between contradictory records, take personal case notes, and request graduated hints.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
        width: '100%',
      }}>
        <div style={{
          backgroundColor: 'var(--surface-secondary)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-lg)',
          padding: '48px 32px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '18px',
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(217, 164, 65, 0.08) 0%, transparent 70%)',
        }}>
          <h2 style={{ fontSize: '32px' }}>Ready to launch your first investigation?</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '540px' }}>
            No sign-up required to play. Start immediately with guest session or register to save persistent case dossiers.
          </p>
          <Link to="/create" className="btn btn-primary" style={{ padding: '14px 36px', fontSize: '15px' }}>
            Launch Case Creator &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
