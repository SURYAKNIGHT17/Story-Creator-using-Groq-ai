import axios, { AxiosError } from 'axios'

const FALLBACKS = ['http://127.0.0.1:8000', 'http://localhost:8000'] as const
const ENV_URL = import.meta.env.VITE_API_URL as string | undefined
const API_URL = ENV_URL || FALLBACKS[0]

export const api = axios.create({
  baseURL: API_URL,
  timeout: 30_000,
})

api.interceptors.response.use(
  (res) => res,
  (err: AxiosError) => {
    const message = (err.response?.data as any)?.detail
      || (err.response?.data as any)?.error?.message
      || err.message
      || 'Network error'
    return Promise.reject(new Error(message))
  }
)

export async function getHealth(base?: string): Promise<boolean> {
  try {
    const url = (base || api.defaults.baseURL!) + '/health'
    const { data } = await axios.get(url, { timeout: 5000 })
    return Boolean(data && data.status === 'ok')
  } catch {
    return false
  }
}

export type GeneratePayload = {
  topic: string
  style?: string
  words?: number
  outline?: boolean
}

export async function generateBlog(payload: GeneratePayload): Promise<{ content: string; model: string }> {
  // If baseURL is unreachable, try fallbacks once
  try {
    const { data } = await api.post('/generate-blog', payload)
    return data
  } catch (e) {
    for (const fb of FALLBACKS) {
      if (fb === api.defaults.baseURL) continue
      try {
        const { data } = await axios.post(fb + '/generate-blog', payload, { timeout: 30_000 })
        return data
      } catch {}
    }
    throw e
  }
}
