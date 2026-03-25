import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Helper to get token from cookie
function getTokenFromCookie(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp('(^| )access_token=([^;]+)'))
  return match ? match[2] : null
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,  // Include cookies in cross-origin requests
})

// Add auth token to requests (from cookie)
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = getTokenFromCookie()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

export default api

// Auth API
export const authAPI = {
  register: (data: { email: string; username: string; password: string }) =>
    api.post('/api/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/api/auth/login', data),
  getMe: () => api.get('/api/auth/me'),
  logout: () => api.post('/api/auth/logout'),
}

// Destinations API
export const destinationsAPI = {
  list: () => api.get('/api/destinations'),
  get: (id: number) => api.get(`/api/destinations/${id}`),
}

// Attractions API
export const attractionsAPI = {
  list: (params?: { destination_id?: number; city?: string }) =>
    api.get('/api/attractions', { params }),
  get: (id: number) => api.get(`/api/attractions/${id}`),
}

// Restaurants API
export const restaurantsAPI = {
  list: (params?: { city?: string }) =>
    api.get('/api/restaurants', { params }),
  get: (id: number) => api.get(`/api/restaurants/${id}`),
}

// Itineraries API
export const itinerariesAPI = {
  list: () => api.get('/api/itineraries'),
  get: (id: number) => api.get(`/api/itineraries/${id}`),
  generate: (data: { destination: string; days: number; preferences?: object }) =>
    api.post('/api/itineraries/generate', data),
}

// Weather API
export const weatherAPI = {
  get: (city: string) => api.get(`/api/weather/${city}`),
}
