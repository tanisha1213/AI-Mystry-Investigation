import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiGetCase, apiStartInvestigation, apiSubmitAccusation } from '../services/api';
import AccusationModal from '../components/investigation/AccusationModal';
import LoadingScreen from '../components/common/LoadingScreen';

export default function Accusation() {
  const { caseId } = useParams();
  const navigate = useNavigate();

  const [caseData, setCaseData] = useState(null);
  const [investigation, setInvestigation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        const cRes = await apiGetCase(caseId);
        setCaseData(cRes.data);
        const invRes = await apiStartInvestigation(caseId);
        setInvestigation(invRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [caseId]);

  const handleSubmit = async (payload) => {
    if (!investigation) return;
    await apiSubmitAccusation(investigation._id, payload);
    navigate(`/investigation/${caseId}/result`);
  };

  if (loading) {
    return <LoadingScreen title="Opening Accusation Chamber..." />;
  }

  return (
    <AccusationModal
      isOpen={true}
      onClose={() => navigate(`/investigation/${caseId}`)}
      suspects={caseData?.suspects || []}
      evidenceList={caseData?.evidence || []}
      onSubmitAccusation={handleSubmit}
    />
  );
}
