// ─── Brabus Barbershop API Client ────────────────────────
// Capa de comunicación entre el Frontend y el Backend

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

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
  create: (service) =>
    request('/services', {
      method: 'POST',
      body: JSON.stringify(service),
    }),
  update: (id, service) =>
    request(`/services/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(service),
    }),
  delete: (id) =>
    request(`/services/${id}`, {
      method: 'DELETE',
    }),
};

// ═══════════════════════════════════════════════════════════
//  SHIFTS
// ═══════════════════════════════════════════════════════════

export const shiftsApi = {
  getActive: (barberId) => request(`/shifts/active/${barberId}`),

  start: (barberId) => {
    // Calculamos el inicio y fin del día en la zona horaria local del cliente
    // y lo enviamos como strings ISO (UTC) al backend.
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).toISOString();
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).toISOString();

    return request('/shifts/start', {
      method: 'POST',
      body: JSON.stringify({ barber_id: barberId, start_of_day: startOfDay, end_of_day: endOfDay }),
    });
  },

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

// ═══════════════════════════════════════════════════════════
//  HISTORY
// ═══════════════════════════════════════════════════════════

export const historyApi = {
  getShifts: (barberId, from, to) => {
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    const qs = params.toString();
    return request(`/history/${barberId}${qs ? '?' + qs : ''}`);
  },

  getDaily: (barberId, month) => {
    const params = month ? `?month=${month}` : '';
    return request(`/history/${barberId}/daily${params}`);
  },
};

