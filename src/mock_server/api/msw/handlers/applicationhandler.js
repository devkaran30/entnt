import { http, HttpResponse } from "msw";
import { applicationsTable } from "../../db/indexDB";

export const applicationhandler = [
  // existing routes...

  // 🆕 GET /api/applications?jobId=123
  http.get("/api/applications", async ({ request }) => {
    const url = new URL(request.url);
    const jobId = url.searchParams.get("jobId");

    if (!jobId) {
      const all = await applicationsTable.toArray();
      return HttpResponse.json({ items: all });
    }

    const filtered = await applicationsTable.where("jobId").equals(jobId).toArray();
    return HttpResponse.json({ items: filtered });
  }),
];
