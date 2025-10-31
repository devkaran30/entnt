// src/utils/api/httpClient.js
export async function httpRequest(url, options = {}) {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options,
    })
  
    if (!res.ok) {
      const errText = await res.text()
      throw new Error(
        `HTTP ${res.status}: ${errText || res.statusText} (${url})`
      )
    }
  
    // Try parsing JSON safely
    try {
      return await res.json()
    } catch {
      return null
    }
  }
  