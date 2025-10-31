// src/utils/api/apiClient.js
// All calls go through the network so MSW handlers intercept these.

const DEFAULT_BASE = '/api'; // our MSW routes will be prefixed with /api

function qs(obj = {}) {
  const params = new URLSearchParams();
  Object.entries(obj).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    params.append(k, v);
  });
  const s = params.toString();
  return s ? `?${s}` : '';
}

async function request(method, path, { query, body } = {}) {
  const url = `${DEFAULT_BASE}${path}${qs(query)}`;
  const options = { method, headers: { 'Content-Type': 'application/json' } };
  if (body !== undefined) options.body = JSON.stringify(body);
  const res = await fetch(url, options);
  // Throw for non-2xx to let callers handle rollback logic
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) {
    const err = new Error(data?.message || 'Request failed');
    err.status = res.status;
    err.body = data;
    throw err;
  }
  return data;
}

export const api = {
  getJobs: (opts) => request('GET', '/jobs', { query: opts }),
  postJob: (job) => request('POST', '/jobs', { body: job }),
  patchJob: (id, patch) => request('PATCH', `/jobs/${id}`, { body: patch }),
  patchJobReorder: (id, fromOrder, toOrder) =>
    request('PATCH', `/jobs/${id}/reorder`, { body: { fromOrder, toOrder } }),

  getCandidates: (opts) => request('GET', '/candidates', { query: opts }),
  postCandidate: (candidate) => request('POST', '/candidates', { body: candidate }),
  patchCandidate: (id, patch) => request('PATCH', `/candidates/${id}`, { body: patch }),
  getCandidateTimeline: (id) => request('GET', `/candidates/${id}/timeline`),

  getAssessments: (jobId) => request('GET', `/assessments/${jobId}`),
  putAssessments: (jobId, payload) => request('PUT', `/assessments/${jobId}`, { body: payload }),
  postAssessmentSubmit: (jobId, payload) => request('POST', `/assessments/${jobId}/submit`, { body: payload })
};
