const BASE_URL = "/api/applications";

// ✅ Get all applications for a given job
export async function getApplicationsByJobId(jobId) {
  const res = await fetch(`${BASE_URL}?jobId=${jobId}`);
  if (!res.ok) throw new Error("Failed to fetch applications");
  const data = await res.json();
  return data?.items || [];
}
