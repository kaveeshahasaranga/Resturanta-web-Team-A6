const BASE_URL = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('fuchsius_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (res) => {
  // Safely parse body — empty body or non-JSON won't crash
  let data;
  const text = await res.text();
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {};
  }
  if (!res.ok) {
    throw new Error(data.message || `Server error ${res.status}`);
  }
  return data;
};

// Wraps fetch to catch network-level failures (backend not running, etc.)
const safeFetch = (input, init) =>
  fetch(input, init).catch(() => {
    throw new Error('Cannot connect to server. Make sure the backend is running on port 5000.');
  });

export const api = {
  get:    (endpoint)        => safeFetch(`${BASE_URL}${endpoint}`, { headers: getHeaders() }).then(handleResponse),
  post:   (endpoint, body)  => safeFetch(`${BASE_URL}${endpoint}`, { method: 'POST',   headers: getHeaders(), body: JSON.stringify(body) }).then(handleResponse),
  put:    (endpoint, body)  => safeFetch(`${BASE_URL}${endpoint}`, { method: 'PUT',    headers: getHeaders(), body: JSON.stringify(body) }).then(handleResponse),
  patch:  (endpoint, body)  => safeFetch(`${BASE_URL}${endpoint}`, { method: 'PATCH',  headers: getHeaders(), body: JSON.stringify(body) }).then(handleResponse),
  delete: (endpoint)        => safeFetch(`${BASE_URL}${endpoint}`, { method: 'DELETE', headers: getHeaders() }).then(handleResponse),
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

export const categoryApi = {
  getAll: () => api.get('/categories'),
  create: data => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: id => api.delete(`/categories/${id}`),
};
export const cartApi = { quote: items => api.post('/cart/quote', { items }) };
menuApi.availability = (id, isAvailable) => api.patch(`/menu/${id}/availability`, { isAvailable });
menuApi.removeImage = id => api.delete(`/menu/${id}/image`);
menuApi.uploadImage = (id, file) => {
  const body = new FormData();
  body.append('image', file);
  const token = localStorage.getItem('fuchsius_token');
  return safeFetch(`/api/menu/${id}/image`, { method: 'POST', body, headers: token ? { Authorization: `Bearer ${token}` } : {} }).then(handleResponse);
};
