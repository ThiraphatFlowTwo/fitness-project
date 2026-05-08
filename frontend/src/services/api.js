import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Trainee API
export const traineeAPI = {
  getAll:  ()       => api.get("/trainees"),
  add:     (data)   => api.post("/trainees", data),
  update:  (id, data) => api.put(`/trainees/${id}`, data),
  delete:  (id)     => api.delete(`/trainees/${id}`),
};

export default api