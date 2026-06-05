const appendSearchParams = (
  baseUrl: string | null,
  searchParams?: URLSearchParams,
  excludeParam?: string,
): string | null => {
  if (!baseUrl) return null

  let updatedUrl = baseUrl

  if (searchParams) {
    Array.from(searchParams.entries()).forEach(([key, value]) => {
      if (value && (!excludeParam || key !== excludeParam)) {
        if (updatedUrl.includes(key)) return
        updatedUrl += `${updatedUrl.includes('?') ? '&' : '?'}${key}=${value}`
      }
    })
  }

  return updatedUrl
}
export { appendSearchParams }
