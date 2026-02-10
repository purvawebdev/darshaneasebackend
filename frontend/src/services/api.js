import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
};

// Temples API
export const templesAPI = {
    getAllTemples: () => api.get('/temples'),
    getTempleById: (id) => api.get(`/temples/${id}`),
};

// Slots API
export const slotsAPI = {
    getSlots: (templeId, date) => {
        const params = {};
        if (templeId) params.templeId = templeId;
        if (date) params.date = date;
        return api.get('/slots', { params });
    },
};

// Bookings API
export const bookingsAPI = {
    createBooking: (slotId) => api.post('/bookings', { slotId }),
    getMyBookings: () => api.get('/bookings'),
};

export default api;
