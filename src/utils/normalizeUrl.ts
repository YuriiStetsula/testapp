export const normalizeUrl = (params: { url?: string; baseUrl?: string }) => {
  const { url, baseUrl } = params

  if (!baseUrl) {
    throw new Error('baseUrl is mandatory')
  }

  if (!url) {
    return baseUrl
  }

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  if (url.startsWith('/')) {
    return `${baseUrl}${url}`
  }

  return `${baseUrl}/${url}`
}
