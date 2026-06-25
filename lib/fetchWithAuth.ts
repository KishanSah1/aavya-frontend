import { useAuthStore } from './store/authStore'

const API = process.env.NEXT_PUBLIC_API_BASE_URL

export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const isFormData = options.body instanceof FormData
  const hasBody = options.body != null

  const withHeaders = (extra: Record<string, string> = {}): RequestInit => ({
    ...options,
    headers: {
      ...(hasBody && !isFormData ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
      ...extra,
    },
  })

  const store = useAuthStore.getState()
  if (!store.accessToken) return fetch(url, withHeaders())

  const res = await fetch(url, withHeaders({ Authorization: `Bearer ${store.accessToken}` }))
  if (res.status !== 401 || !store.refreshToken) return res

  const refreshRes = await fetch(`${API}/api/v1/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: store.refreshToken }),
  })

  if (!refreshRes.ok) {
    useAuthStore.getState().logout()
    return res
  }

  const { data } = await refreshRes.json()
  useAuthStore.getState().updateAccessToken(data.accessToken)

  return fetch(url, withHeaders({ Authorization: `Bearer ${data.accessToken}` }))
}
