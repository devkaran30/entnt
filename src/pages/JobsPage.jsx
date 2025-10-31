// src/pages/JobsPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import JobForm from "../components/jobs/JobForm";
import JobList from "../components/jobs/JobList";
import {
  getJobs,
  createJob,
  updateJob,
  reorderJob,
} from "../utils/api"; // ✅ MSW API calls

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Load jobs from API
  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true);
        const data = await getJobs();
        setJobs(data || []);
      } catch (err) {
        console.error("Failed to load jobs:", err);
        setError("Unable to load jobs.");
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  // ✅ Create a new job
  const addJob = async (title) => {
    try {
      const newJob = {
        title,
        slug: title.toString().toLowerCase().replace(/\s+/g, "-"),
        status: "active",
        tags: [],
      };
      const created = await createJob(newJob);
      setJobs((prev) => [...prev, created]);
    } catch (err) {
      console.error("Failed to add job:", err);
      setError("Unable to create job.");
    }
  };

  // ✅ Toggle archive / active
  const toggleArchive = async (id, currentStatus) => {
    try {
      const updated = await updateJob(id, {
        status: currentStatus === "archived" ? "active" : "archived",
      });
      setJobs((prev) =>
        prev.map((j) => (j.id === id ? updated : j))
      );
    } catch (err) {
      console.error("Failed to update job:", err);
      setError("Unable to update job status.");
    }
  };

  // ✅ Move job (reorder)
  const moveJob = async (index, dir) => {
    const newIndex = index + dir;
    if (newIndex < 0 || newIndex >= jobs.length) return;

    const reordered = [...jobs];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(newIndex, 0, moved);
    setJobs(reordered);

    try {
      await reorderJob(moved.id, { fromOrder: index + 1, toOrder: newIndex + 1 });
    } catch (err) {
      console.error("Reorder failed:", err);
      setError("Reordering failed (simulated 500 possible).");
    }
  };

  // ✅ Edit job title
  const editJob = async (id, newTitle) => {
    try {
      const updated = await updateJob(id, {
        title: newTitle,
        slug: newTitle.toLowerCase().replace(/\s+/g, "-"),
      });
      setJobs((prev) => prev.map((j) => (j.id === id ? updated : j)));
    } catch (err) {
      console.error("Edit failed:", err);
      setError("Failed to update job.");
    }
  };

  // ✅ Navigate to job details (or assessments)
  const handleJobClick = (id) => {
    navigate(`/jobs/${id}/`);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3 text-gray-700">Manage Jobs</h2>

      {error && <p className="text-red-500">{error}</p>}
      {loading && <p>Loading jobs...</p>}

      <JobForm onAdd={addJob} />
      <JobList
        jobs={jobs}
        onArchive={toggleArchive}
        onMove={moveJob}
        onEdit={editJob}
        onClick={handleJobClick}
      />
    </div>
  );
}
