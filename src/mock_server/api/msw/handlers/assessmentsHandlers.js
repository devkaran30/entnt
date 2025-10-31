// src/utils/api/msw/handlers/assessmentsHandlers.js
import { http, HttpResponse } from 'msw'
import { assessmentsTable } from '../../db/indexDB.js'

const MIN_LATENCY = 200
const MAX_LATENCY = 1200
const WRITE_ERROR_RATE = 0.08

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}
function randomLatency() {
  return MIN_LATENCY + Math.random() * (MAX_LATENCY - MIN_LATENCY)
}
function randomFail(rate) {
  return Math.random() < rate
}
const base = '/api'

export const assessmentsHandlers = [
// ======================================================
// ✅ GET /assessments → return all assessments (with optional filters)
// ======================================================
http.get('/api/assessments', async ({ request }) => {
  await sleep(randomLatency());

  const url = new URL(request.url);
  const search = url.searchParams.get('search') || '';
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const pageSize = parseInt(url.searchParams.get('pageSize') || '20', 10);

  // start query from full table
  let query = assessmentsTable;

  // if you ever add a 'status' or 'jobTitle' field, you can filter like:
  // if (status) query = query.where('status').equals(status);

  // Dexie’s .toArray() will get all results in memory
  let allAssessments = (await query.toArray?.()) || [];

  // If no .toArray() (non-Dexie wrapper), fallback to manual iteration
  if (!allAssessments.length && typeof query.getAllKeys === 'function') {
    const keys = await query.getAllKeys();
    for (const key of keys) {
      const doc = await query.get(key);
      if (doc) allAssessments.push(doc);
    }
  }

  // Apply search filter (matches jobId or title)
  if (search) {
    const s = search.toLowerCase();
    allAssessments = allAssessments.filter(
      (a) =>
        (a.jobId || '').toLowerCase().includes(s) ||
        (a.title || a.jobTitle || '').toLowerCase().includes(s)
    );
  }

  // Pagination logic
  const total = allAssessments.length;
  const start = (page - 1) * pageSize;
  const paged = allAssessments.slice(start, start + pageSize);

  // Return consistent structure
  return HttpResponse.json({
    items: paged,
    total,
    page,
    pageSize,
  });
}),

  // ======================================================
  // GET /assessments/:jobId
  // ======================================================
  http.get(`${base}/assessments/:jobId`, async ({ params }) => {
    await sleep(randomLatency())

    const { jobId } = params
    const assessment = await assessmentsTable.get(jobId)

    if (!assessment) {
      return HttpResponse.json(
        { message: 'Assessment not found' },
        { status: 404 }
      )
    }

    return HttpResponse.json(assessment, { status: 200 })
  }),

  // ======================================================
  // PUT /assessments/:jobId
  // ======================================================
  http.put(`${base}/assessments/:jobId`, async ({ params, request }) => {
    await sleep(randomLatency())

    if (randomFail(WRITE_ERROR_RATE)) {
      return HttpResponse.json(
        { message: 'Random write error (PUT /assessments/:jobId)' },
        { status: 500 }
      )
    }

    const { jobId } = params
    const payload = await request.json()
    // payload shape: { questions: [...] }
    const existing = await assessmentsTable.get(jobId)
    const doc = { jobId, ...payload, updatedAt: Date.now() }

    if (existing) {
      await assessmentsTable.put(doc)
    } else {
      await assessmentsTable.add(doc)
    }

    return HttpResponse.json(doc, { status: 200 })
  }),

  // ======================================================
  // POST /assessments/:jobId/submit
  // ======================================================
  http.post(`${base}/assessments/:jobId/submit`, async ({ params, request }) => {
    await sleep(randomLatency())

    if (randomFail(WRITE_ERROR_RATE)) {
      return HttpResponse.json(
        { message: 'Random write error (POST /assessments/:jobId/submit)' },
        { status: 500 }
      )
    }

    const { jobId } = params
    const body = await request.json() // { candidateId, responses: [...] }

    const existing = await assessmentsTable.get(jobId)
    const doc = existing
      ? { ...existing }
      : { jobId, questions: [], submissions: [] }

    doc.submissions = doc.submissions || []
    doc.submissions.push({ ...body, submittedAt: Date.now() })

    await assessmentsTable.put(doc)

    return HttpResponse.json({ success: true }, { status: 201 })
  }),
]
