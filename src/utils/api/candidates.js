// src/utils/api/candidatesApi.js
import { httpRequest } from './httpClient.js'

const BASE = '/api/candidates'

// GET /candidates?search=&stage=&page=
export async function getCandidates(params = {}) {
  const query = new URLSearchParams(params).toString()
  return httpRequest(`${BASE}?${query}`)
}

// POST /candidates
export async function createCandidate(payload) {
  return httpRequest(BASE, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

// PATCH /candidates/:id
export async function updateCandidate(id, patch) {
  return httpRequest(`${BASE}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  })
}

// GET /candidates/:id/timeline
export async function getCandidateTimeline(id) {
  return httpRequest(`${BASE}/${id}/timeline`)
}
