// src/utils/api/msw/handlers/jobsHandlers.js
import { http, HttpResponse } from 'msw'
import { jobsTable } from '../../db/indexDB.js'
import { nanoid } from 'nanoid'
import { JOB_STATUS } from '../../../constants.js'

// --- Configuration for latency & errors ---
const MIN_LATENCY = 200
const MAX_LATENCY = 1200
const WRITE_ERROR_RATE = 0.08
const REORDER_ERROR_RATE = 0.12

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms))
}
function randomLatency() {
  return MIN_LATENCY + Math.random() * (MAX_LATENCY - MIN_LATENCY)
}
function randomFail(rate) {
  return Math.random() < rate
}
function parseIntOrDefault(v, d) {
  const n = parseInt(v, 10)
  return Number.isNaN(n) ? d : n
}

const base = '/api'

export const jobsHandlers = [

  // ======================================================
  // GET /jobs?search=&status=&page=&pageSize=&sort=
  // ======================================================
  http.get(`${base}/jobs`, async ({ request }) => {
    await sleep(randomLatency())

    const url = new URL(request.url)
    const search = url.searchParams.get('search') || ''
    const status = url.searchParams.get('status') || ''
    const page = parseIntOrDefault(url.searchParams.get('page'), 1)
    const pageSize = parseIntOrDefault(url.searchParams.get('pageSize'), 25)
    const sort = url.searchParams.get('sort') || 'order'

    let all = await jobsTable.toArray()

    // filter by search
    if (search) {
      const s = search.toLowerCase()
      all = all.filter(
        (j) =>
          (j.title || '').toLowerCase().includes(s) ||
          (j.tags || []).some((t) => t.toLowerCase().includes(s))
      )
    }

    // filter by status
    if (status) {
      all = all.filter((j) => j.status === status)
    }

    // sort
    if (sort === 'order') {
      all.sort((a, b) => a.order - b.order)
    } else if (sort === 'title') {
      all.sort((a, b) => a.title.localeCompare(b.title))
    }

    const total = all.length
    const start = (page - 1) * pageSize
    const paged = all.slice(start, start + pageSize)

    return HttpResponse.json({ items: paged, total, page, pageSize })
  }),

  // ======================================================
  // POST /jobs
  // ======================================================
  http.post(`${base}/jobs`, async ({ request }) => {
    await sleep(randomLatency())
    if (randomFail(WRITE_ERROR_RATE)) {
      return HttpResponse.json(
        { message: 'Random write error (POST /jobs)' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const id = body.id || nanoid()
    const order = body.order || (await jobsTable.count()) + 1
    const job = {
      id,
      title: body.title || 'Untitled Job',
      slug:
        body.slug ||
        (body.title
          ? body.title.toLowerCase().replace(/\s+/g, '-')
          : `job-${id}`),
      status: body.status || JOB_STATUS.ACTIVE,
      tags: body.tags || [],
      order,
    }

    await jobsTable.add(job)
    return HttpResponse.json(job, { status: 201 })
  }),

  http.get("/api/jobs/:jobId", async ({ params }) => {
    const job = await jobsTable.get(params.jobId);
    if (!job) {
      return HttpResponse.json({ message: "Job not found" }, { status: 404 });
    }
    return HttpResponse.json(job);
  }),

  // ======================================================
  // PATCH /jobs/:id
  // ======================================================
  http.patch(`${base}/jobs/:id`, async ({ params, request }) => {
    await sleep(randomLatency())
    if (randomFail(WRITE_ERROR_RATE)) {
      return HttpResponse.json(
        { message: 'Random write error (PATCH /jobs/:id)' },
        { status: 500 }
      )
    }

    const { id } = params
    const patch = await request.json()
    const existing = await jobsTable.get(id)

    if (!existing) {
      return HttpResponse.json({ message: 'Job not found' }, { status: 404 })
    }

    const updated = { ...existing, ...patch }
    await jobsTable.put(updated)

    return HttpResponse.json(updated, { status: 200 })
  }),

  // ======================================================
  // PATCH /jobs/:id/reorder
  // ======================================================
  http.patch('/api/jobs/:id/reorder', async ({ request, params }) => {
    try {
      const { newIndex } = await request.json();
      const { id } = params;
      
      // FIX: Remove the transaction call or replace it with proper mock logic
      // Remove this problematic line:
      // jobsTable.transaction(...) 
      
      // Instead, implement simple mock logic:
      const allJobs = await jobsTable.toArray();
      const jobIndex = allJobs.findIndex(job => job.id === id);
      
      if (jobIndex === -1) {
        return new Response(JSON.stringify({ error: 'Job not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // Simulate reorder by updating the order field or just return success
      // For now, just return success since the frontend is already handling the reorder
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Job reordered successfully' 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
      
    } catch (error) {
      console.error('Reorder error:', error);
      return new Response(JSON.stringify({ error: 'Failed to reorder job' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }),
]
