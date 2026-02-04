import { normalizeUrl } from '@/utils/normalizeUrl'

export async function fetchJson<T>(
  url: string,
  init?: RequestInit,
): Promise<T> {
  if (!process.env.EXPO_PUBLIC_API_URL) {
    throw new Error(
      'fetchJson: URL is missing and EXPO_PUBLIC_API_URL is not set',
    )
  }

  const resolvedUrl = normalizeUrl({
    url,
    baseUrl: process.env.EXPO_PUBLIC_API_URL,
  })

  const res = await fetch(resolvedUrl, {
    headers: { Accept: 'application/json', ...(init?.headers ?? {}) },
    ...init,
  })

  const contentType = res.headers.get('content-type') ?? ''
  const isJson = contentType.includes('application/json')
  const raw = isJson ? await res.json() : await res.text()

  if (!res.ok) {
    const msg =
      typeof raw === 'string'
        ? raw
        : (raw as any)?.message || (raw as any)?.error || `HTTP ${res.status}`
    throw new Error(String(msg))
  }

  return raw as T
}
