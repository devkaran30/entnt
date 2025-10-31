// src/utils/api/assessmentsApi.js
import { httpRequest } from './httpClient.js'

const BASE = '/api/assessments'

// GET /api/assessments
export async function getAllAssessments() {
  return httpRequest('/api/assessments')
}


// GET /assessments/:jobId
export async function getAssessment(jobId) {
  return httpRequest(`${BASE}/${jobId}`)
}

// PUT /assessments/:jobId
export async function saveAssessment(jobId, payload) {
  return httpRequest(`${BASE}/${jobId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

// POST /assessments/:jobId/submit
export async function submitAssessment(jobId, payload) {
  return httpRequest(`${BASE}/${jobId}/submit`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
