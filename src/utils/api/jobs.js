const BASE_URL = "/api/jobs";

export async function getJobs() {
  const res = await fetch(BASE_URL);
  const data = await res.json();
  return data?.items || [];
}

export async function getJobById(id) {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch job with id ${id}`);
  return res.json();
}

export async function createJob(jobData) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(jobData),
  });
  if (!res.ok) throw new Error("Failed to add job");
  return res.json();
}

export async function updateJob(id, updates) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  return res.json();
}

export async function reorderJob(id, data) {
  const res = await fetch(`${BASE_URL}/${id}/reorder`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}
