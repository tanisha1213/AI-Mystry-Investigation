import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiGetEvidenceDetail } from '../services/api';
import EvidenceViewer from '../components/evidence/EvidenceViewer';
import LoadingScreen from '../components/common/LoadingScreen';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export default function EvidenceDetail() {
  const { caseId, evidenceId } = useParams();
  const navigate = useNavigate();

  const [evidence, setEvidence] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadItem() {
      try {
        setLoading(true);
        const res = await apiGetEvidenceDetail(caseId, evidenceId);
        setEvidence(res.data);
      } catch (err) {
        setError(err.message || 'Evidence record not found.');
      } finally {
        setLoading(false);
      }
    }
    loadItem();
  }, [caseId, evidenceId]);

  if (loading) {
    return <LoadingScreen title="Accessing Evidence Vault Record..." />;
  }

  if (error || !evidence) {
    return (
      <div style={{ maxWidth: '600px', margin: '80px auto', textAlign: 'center', padding: '0 24px' }}>
        <AlertCircle size={40} color="var(--danger)" style={{ marginBottom: '14px' }} />
        <h2 style={{ fontSize: '22px', marginBottom: '8px' }}>Record Unavailable</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>{error}</p>
        <Link to={`/investigation/${caseId}`} className="btn btn-secondary">
          Return to Case
        </Link>
      </div>
    );
  }

  return (
    <EvidenceViewer
      evidence={evidence}
      onClose={() => navigate(`/investigation/${caseId}`)}
    />
  );
}
