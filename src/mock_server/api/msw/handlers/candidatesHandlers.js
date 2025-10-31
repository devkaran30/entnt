// src/utils/api/msw/handlers/candidatesHandlers.js
import { http, HttpResponse } from 'msw'
import { candidatesTable, timelinesTable } from '../../db/indexDB.js'
import { nanoid } from 'nanoid'

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

function parseIntOrDefault(v, d) {
  const n = parseInt(v, 10)
  return Number.isNaN(n) ? d : n
}

export const candidatesHandlers = [

  // ======================================================
  // GET /candidates?search=&stage=&page=
  // ======================================================
  http.get('/api/candidates', async ({ request }) => {
    await sleep(randomLatency());
  
    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';
    const stage = url.searchParams.get('stage') || '';
    const page = parseIntOrDefault(url.searchParams.get('page'), 1);
    const pageSize = parseIntOrDefault(url.searchParams.get('pageSize'), 20);
  
    let query = candidatesTable;
  
    // Filter by stage
    if (stage) {
      query = query.where('stage').equals(stage);
    }
  
    // For search (Dexie doesn't support `or` easily), you can prefilter if small
    let allCandidates = await query.toArray();
    if (search) {
      const s = search.toLowerCase();
      allCandidates = allCandidates.filter(
        (c) =>
          (c.name || '').toLowerCase().includes(s) ||
          (c.email || '').toLowerCase().includes(s)
      );
    }
  
    const total = allCandidates.length;
    const start = (page - 1) * pageSize;
    const paged = allCandidates.slice(start, start + pageSize);
  
    return HttpResponse.json({
      items: paged,
      total,
      page,
      pageSize,
    });
  }),
  

  // ======================================================
  // POST /candidates
  // ======================================================
  http.post(`${base}/candidates`, async ({ request }) => {
    await sleep(randomLatency())

    if (randomFail(WRITE_ERROR_RATE)) {
      return HttpResponse.json(
        { message: 'Random write error (POST /candidates)' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const id = body.id || nanoid()
    const candidate = {
      id,
      name: body.name || 'Unknown',
      email: body.email || `${id}@example.com`,
      jobId: body.jobId || null,
      stage: body.stage || 'applied',
      createdAt: Date.now(),
    }

    await candidatesTable.add(candidate)
    return HttpResponse.json(candidate, { status: 201 })
  }),

  // ======================================================
  // PATCH /candidates/:id
  // ======================================================
  http.patch(`${base}/candidates/:id`, async ({ params, request }) => {
    await sleep(randomLatency())

    if (randomFail(WRITE_ERROR_RATE)) {
      return HttpResponse.json(
        { message: 'Random write error (PATCH /candidates/:id)' },
        { status: 500 }
      )
    }

    const { id } = params
    const patch = await request.json()
    const existing = await candidatesTable.get(id)

    if (!existing) {
      return HttpResponse.json(
        { message: 'Candidate not found' },
        { status: 404 }
      )
    }

    const updated = { ...existing, ...patch }
    await candidatesTable.put(updated)

    // If stage changed, record in timeline
    if (patch.stage && patch.stage !== existing.stage) {
      await timelinesTable.add({
        candidateId: id,
        entries: [
          { at: Date.now(), note: `Stage changed to ${patch.stage}` },
        ],
      })
    }

    return HttpResponse.json(updated, { status: 200 })
  }),

  // ======================================================
  // GET /candidates/:id/timeline
  // ======================================================
  http.get(`${base}/candidates/:id/timeline`, async ({ params }) => {
    await sleep(randomLatency())

    const { id } = params
    const rows = await timelinesTable.where({ candidateId: id }).toArray()
    const entries = rows.flatMap((r) => r.entries || [])

    return HttpResponse.json({ candidateId: id, entries }, { status: 200 })
  }),
]
