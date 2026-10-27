const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

function getStoredGuestId() {
  return localStorage.getItem('ai_mystery_guest_id') || '';
}

function setStoredGuestId(id) {
  if (id) {
    localStorage.setItem('ai_mystery_guest_id', id);
  }
}

async function request(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const guestId = getStoredGuestId();
  if (guestId) {
    headers['x-guest-session-id'] = guestId;
  }

  const token = localStorage.getItem('ai_mystery_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  const guestHeader = response.headers.get('x-guest-session-id');
  if (guestHeader) {
    setStoredGuestId(guestHeader);
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.code = data.code || 'UNKNOWN_ERROR';
    throw error;
  }

  return data;
}

// Authentication
export async function apiRegister(payload) {
  const res = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (res.token) localStorage.setItem('ai_mystery_token', res.token);
  return res;
}

export async function apiLogin(payload) {
  const res = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (res.token) localStorage.setItem('ai_mystery_token', res.token);
  return res;
}

export async function apiLogout() {
  localStorage.removeItem('ai_mystery_token');
  return request('/auth/logout', { method: 'POST' });
}

export async function apiGetMe() {
  return request('/auth/me', { method: 'GET' });
}

// Mystery Cases
export async function apiCreateCase(payload) {
  return request('/cases', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function apiGetCaseStatus(caseId) {
  return request(`/cases/${caseId}/status`, { method: 'GET' });
}

export async function apiGetCase(caseId) {
  return request(`/cases/${caseId}`, { method: 'GET' });
}

export async function apiListCases() {
  return request('/cases', { method: 'GET' });
}

// Investigation
export async function apiStartInvestigation(caseId) {
  return request(`/cases/${caseId}/investigations`, { method: 'POST' });
}

export async function apiGetInvestigation(investigationId) {
  return request(`/investigations/${investigationId}`, { method: 'GET' });
}

export async function apiUpdateNotes(investigationId, notes) {
  return request(`/investigations/${investigationId}/notes`, {
    method: 'PATCH',
    body: JSON.stringify({ notes }),
  });
}

export async function apiUpdateEvidenceBoard(investigationId, boardData) {
  return request(`/investigations/${investigationId}/evidence-board`, {
    method: 'PATCH',
    body: JSON.stringify(boardData),
  });
}

export async function apiMarkEvidenceReviewed(investigationId, evidenceId) {
  return request(`/investigations/${investigationId}/evidence/${evidenceId}/review`, {
    method: 'POST',
  });
}

export async function apiRequestHint(investigationId, hintLevel = 1) {
  return request(`/investigations/${investigationId}/hints`, {
    method: 'POST',
    body: JSON.stringify({ hintLevel }),
  });
}

export async function apiSubmitAccusation(investigationId, payload) {
  return request(`/investigations/${investigationId}/accuse`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function apiGetSolution(investigationId) {
  return request(`/investigations/${investigationId}/solution`, {
    method: 'GET',
  });
}

export async function apiGetEvidenceDetail(caseId, evidenceId) {
  return request(`/cases/${caseId}/evidence/${evidenceId}`, {
    method: 'GET',
  });
}
