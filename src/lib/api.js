import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL
const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para agregar token admin
api.interceptors.request.use((config) => {
  if (config.url.includes('/admin/')) {
    config.headers.Authorization = `Bearer ${ADMIN_TOKEN}`
  }
  return config
})

export const createSubscription = async (userEmail, subscriptionType, paymentId, amount) => {
  const response = await api.post('/admin/create-subscription', {
    user_email: userEmail,
    subscription_type: subscriptionType,
    payment_id: paymentId,
    amount: amount
  })
  return response.data
}