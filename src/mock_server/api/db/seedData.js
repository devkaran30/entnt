import {
  jobsTable,
  candidatesTable,
  assessmentsTable,
  timelinesTable,
  applicationsTable,
} from "./indexDB";
import { nanoid } from "nanoid";

const jobTitles = [
  "Frontend Developer",
  "Backend Engineer",
  "UI/UX Designer",
  "DevOps Engineer",
  "QA Tester",
  "Data Analyst",
  "Product Manager",
  "Mobile Developer",
  "Technical Writer",
  "AI Researcher",
  "Game Developer",
  "Database Administrator",
  "Security Analyst",
  "Full Stack Developer",
  "Cloud Architect",
  "HR Tech Lead",
  "Support Engineer",
  "Automation Engineer",
  "ML Engineer",
  "Marketing Analyst",
  "System Administrator",
  "Embedded Developer",
  "Blockchain Developer",
  "Solutions Architect",
  "AR/VR Developer",
];

const workTypes = ["Remote", "Onsite", "Hybrid"];
const locations = ["Bangalore", "Mumbai", "Pune", "Delhi", "Chennai", "Remote"];
const tags = ["React", "Node", "Python", "AWS", "SQL", "Design", "Testing", "AI"];
const stages = ["Applied", "Screening", "Interview", "Offer", "Hired", "Rejected"];

export async function seedIfEmpty() {
  const [jobCount, candidateCount, applicationCount, assessmentCount] = await Promise.all([
    jobsTable.count(),
    candidatesTable.count(),
    applicationsTable.count(),
    assessmentsTable.count(),
  ]);

  console.log(
    `[DB] Current data counts → Jobs: ${jobCount}, Candidates: ${candidateCount}, Applications: ${applicationCount}, Assessments: ${assessmentCount}`
  );

  let jobs = [];

  /** -------------------- 🧱 SEED JOBS -------------------- **/
  if (jobCount === 0) {
    console.log("[DB] Seeding 25 jobs...");
    jobs = jobTitles.map((title, i) => ({
      id: nanoid(),
      title,
      slug: title.toLowerCase().replace(/\s+/g, "-"),
      description: `We’re hiring a ${title} to help build innovative solutions and collaborate with our engineering teams.`,
      salary: `${10 + Math.floor(Math.random() * 15)} LPA`,
      workType: workTypes[Math.floor(Math.random() * workTypes.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      status: Math.random() > 0.8 ? "archived" : "active",
      tags: Array.from(
        { length: 2 + Math.floor(Math.random() * 3) },
        () => tags[Math.floor(Math.random() * tags.length)]
      ),
      order: i + 1,
      createdAt: Date.now(),
    }));
    await jobsTable.bulkAdd(jobs);
  } else {
    jobs = await jobsTable.toArray();
  }

  /** -------------------- 👥 SEED CANDIDATES -------------------- **/
  let candidates = [];
  if (candidateCount === 0) {
    console.log("[DB] Seeding 500 candidates...");
    candidates = Array.from({ length: 500 }).map(() => ({
      id: nanoid(),
      name: `Candidate ${Math.random().toString(36).substring(7)}`,
      email: `${Math.random().toString(36).substring(2, 8)}@mail.com`,
      createdAt: Date.now() - Math.floor(Math.random() * 1000000000),
      stage: "Applied",
    }));
    await candidatesTable.bulkAdd(candidates);
  } else {
    candidates = await candidatesTable.toArray();
  }

  /** -------------------- 📄 SEED APPLICATIONS -------------------- **/
  const currentApplications = await applicationsTable.count();
  if (currentApplications === 0) {
    console.log("[DB] Seeding candidate applications...");

    const applications = [];
    for (const candidate of candidates) {
      // Each candidate applies to 1–3 random jobs
      const numJobs = 1 + Math.floor(Math.random() * 3);
      const selectedJobs = [...jobs].sort(() => 0.5 - Math.random()).slice(0, numJobs);

      selectedJobs.forEach((job) => {
        applications.push({
          id: nanoid(),
          candidateId: candidate.id,
          jobId: job.id,
          stage: stages[Math.floor(Math.random() * stages.length)],
          appliedAt: Date.now() - Math.floor(Math.random() * 1000000000),
        });
      });
    }

    await applicationsTable.bulkAdd(applications);
    console.log(`[DB] ✅ Seeded ${applications.length} applications`);
  }

/** -------------------- 🧾 SEED ASSESSMENTS -------------------- **/
if (assessmentCount === 0) {
  console.log("[DB] Seeding 3 detailed assessments...");

  const sampleAssessments = [
    {
      title: "Frontend Developer Assessment",
      description: "Evaluate core web fundamentals and React understanding.",
      sections: [
        {
          id: "sec-1",
          title: "General Knowledge",
          description: "Basic web and JavaScript knowledge",
          questions: [
            {
              id: "q1",
              type: "single-choice",
              label: "Which HTML tag is used for linking JavaScript files?",
              options: ["<script>", "<link>", "<js>", "<code>"],
              required: true,
              validation: null,
              condition: null,
            },
            {
              id: "q2",
              type: "multi-choice",
              label: "Which of the following are JavaScript frameworks?",
              options: ["React", "Vue", "Laravel", "Angular"],
              required: true,
              validation: null,
              condition: null,
            },
            {
              id: "q3",
              type: "numeric",
              label: "Rate your React experience (1–10)",
              required: true,
              validation: { min: 1, max: 10 },
              condition: null,
            },
          ],
        },
        {
          id: "sec-2",
          title: "React Practical",
          description: "Assess component understanding and state handling",
          questions: [
            {
              id: "q4",
              type: "long-text",
              label: "Explain the difference between props and state in React.",
              required: true,
              validation: { maxLength: 300 },
              condition: null,
            },
          ],
        },
      ],
      submissions: [],
    },
    {
      title: "Backend Engineer Assessment",
      description: "Test your backend and database knowledge.",
      sections: [
        {
          id: "sec-1",
          title: "Backend Basics",
          questions: [
            {
              id: "q1",
              type: "short-text",
              label: "What is REST and why is it important?",
              required: true,
              validation: { maxLength: 200 },
              condition: null,
            },
            {
              id: "q2",
              type: "single-choice",
              label: "Which HTTP method is idempotent?",
              options: ["POST", "PUT", "PATCH", "DELETE"],
              required: true,
              validation: null,
              condition: null,
            },
          ],
        },
        {
          id: "sec-2",
          title: "Database Layer",
          questions: [
            {
              id: "q3",
              type: "numeric",
              label: "How many years of SQL experience do you have?",
              required: false,
              validation: { min: 0, max: 20 },
              condition: null,
            },
          ],
        },
      ],
      submissions: [],
    },
    {
      title: "UI/UX Designer Assessment",
      description: "Measure creativity, design systems, and tool proficiency.",
      sections: [
        {
          id: "sec-1",
          title: "Design Principles",
          questions: [
            {
              id: "q1",
              type: "multi-choice",
              label: "Which tools do you use regularly?",
              options: ["Figma", "Sketch", "Adobe XD", "Photoshop"],
              required: true,
              validation: null,
              condition: null,
            },
            {
              id: "q2",
              type: "long-text",
              label: "Explain your process for creating a new UI component.",
              required: true,
              validation: { maxLength: 500 },
              condition: null,
            },
          ],
        },
        {
          id: "sec-2",
          title: "Portfolio Review",
          questions: [
            {
              id: "q3",
              type: "file-upload",
              label: "Upload your best design sample",
              required: false,
              validation: { maxSizeMB: 10 },
              condition: null,
            },
          ],
        },
      ],
      submissions: [],
    },
  ];

  const allJobs = await jobsTable.toArray();

  // Assign random jobs to assessments
  const assessments = sampleAssessments.map((a) => {
    const job = allJobs[Math.floor(Math.random() * allJobs.length)];
    return {
      jobId: job.id,
      title: a.title,
      description: a.description,
      sections: a.sections,
      submissions: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  });

  await assessmentsTable.bulkAdd(assessments);
  console.log(`[DB] ✅ Seeded ${assessments.length} assessments`);
}


  /** -------------------- 🕒 SAMPLE TIMELINES -------------------- **/
  const sampleCandidates = await candidatesTable.limit(50).toArray();
  const timelines = sampleCandidates.map((c) => ({
    candidateId: c.id,
    entries: [
      { at: Date.now() - 1000 * 60 * 60 * 24 * 5, note: "Applied" },
      { at: Date.now() - 1000 * 60 * 60 * 24 * 3, note: "Screened" },
    ],
  }));
  await timelinesTable.bulkAdd(timelines);

  console.log("[DB] ✅ Seeding complete: Jobs, Candidates, Applications, Assessments, Timelines");
}
