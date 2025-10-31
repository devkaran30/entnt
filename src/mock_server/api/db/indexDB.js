// src/utils/api/db/indexDB.js
import Dexie from "dexie";

export const db = new Dexie("TalentflowDB");

db.version(1).stores({
  jobs: "id, title, slug, description, salary, workType, location, status, tags, order",
  candidates: "id, name, email, jobId, stage",
  assessments: "jobId, questions",
  timelines: "++id, candidateId, entries",
  applications: "++id, candidateId, jobId, appliedAt"
});

export const jobsTable = db.table("jobs");
export const candidatesTable = db.table("candidates");
export const assessmentsTable = db.table("assessments");
export const timelinesTable = db.table("timelines");
export const applicationsTable = db.table("applications");

export async function clearAll() {
  await Promise.all([
    jobsTable.clear(),
    candidatesTable.clear(),
    assessmentsTable.clear(),
    timelinesTable.clear(),
    applicationsTable.clear(),
  ]);
}
