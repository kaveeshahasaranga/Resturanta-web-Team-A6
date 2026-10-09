const BASE_URL = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('fuchsius_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
};

export const api = {
  get:    (endpoint)         => fetch(`${BASE_URL}${endpoint}`, { headers: getHeaders() }).then(handleResponse),
  post:   (endpoint, body)   => fetch(`${BASE_URL}${endpoint}`, { method: 'POST',   headers: getHeaders(), body: JSON.stringify(body) }).then(handleResponse),
  put:    (endpoint, body)   => fetch(`${BASE_URL}${endpoint}`, { method: 'PUT',    headers: getHeaders(), body: JSON.stringify(body) }).then(handleResponse),
  patch:  (endpoint, body)   => fetch(`${BASE_URL}${endpoint}`, { method: 'PATCH',  headers: getHeaders(), body: JSON.stringify(body) }).then(handleResponse),
  delete: (endpoint)         => fetch(`${BASE_URL}${endpoint}`, { method: 'DELETE', headers: getHeaders() }).then(handleResponse),
};

// ─── Resource helpers ────────────────────────────────────────────────────────
export const menuApi = {
  getAll:    (params = '')  => api.get(`/menu${params}`),
  getById:   (id)           => api.get(`/menu/${id}`),
  create:    (data)         => api.post('/menu', data),
  update:    (id, data)     => api.put(`/menu/${id}`, data),
  delete:    (id)           => api.delete(`/menu/${id}`),
};

export const orderApi = {
  getAll:    (params = '')  => api.get(`/orders${params}`),
  getById:   (id)           => api.get(`/orders/${id}`),
  create:    (data)         => api.post('/orders', data),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
  delete:    (id)           => api.delete(`/orders/${id}`),
};

export const chefApi = {
  getAll:    ()             => api.get('/chefs'),
  getById:   (id)           => api.get(`/chefs/${id}`),
  create:    (data)         => api.post('/chefs', data),
  update:    (id, data)     => api.put(`/chefs/${id}`, data),
  delete:    (id)           => api.delete(`/chefs/${id}`),
};

export const contactApi = {
  send:      (data)         => api.post('/contact', data),
  getAll:    ()             => api.get('/contact'),
  markRead:  (id)           => api.patch(`/contact/${id}/read`, {}),
  delete:    (id)           => api.delete(`/contact/${id}`),
};

export const adminApi = {
  dashboard: ()             => api.get('/admin/dashboard'),
};
