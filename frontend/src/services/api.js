// ─── Brabus Barbershop API Client ────────────────────────
// Capa de comunicación entre el Frontend y el Backend

const API_BASE = 'http://localhost:3001/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  };

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error en la solicitud al servidor');
  }

  return data;
}

// ═══════════════════════════════════════════════════════════
//  AUTH
// ═══════════════════════════════════════════════════════════

export const authApi = {
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  logout: () =>
    request('/auth/logout', { method: 'POST' }),

  getProfile: (userId) => request(`/auth/profile/${userId}`),
};

// ═══════════════════════════════════════════════════════════
//  SERVICES
// ═══════════════════════════════════════════════════════════

export const servicesApi = {
  getAll: () => request('/services'),
};

// ═══════════════════════════════════════════════════════════
//  SHIFTS
// ═══════════════════════════════════════════════════════════

export const shiftsApi = {
  getActive: (barberId) => request(`/shifts/active/${barberId}`),

  start: (barberId) =>
    request('/shifts/start', {
      method: 'POST',
      body: JSON.stringify({ barber_id: barberId }),
    }),

  updateStatus: (shiftId, status) =>
    request(`/shifts/${shiftId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  getRecords: (shiftId) => request(`/shifts/${shiftId}/records`),

  getStats: (shiftId) => request(`/shifts/${shiftId}/stats`),
};

// ═══════════════════════════════════════════════════════════
//  WORK RECORDS
// ═══════════════════════════════════════════════════════════

export const workRecordsApi = {
  create: (record) =>
    request('/work-records', {
      method: 'POST',
      body: JSON.stringify(record),
    }),
};
