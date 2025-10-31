// In your JobsPage component
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import JobForm from "../components/jobs/JobForm"; // Updated import
import JobList from "../components/jobs/JobList";
import {
  getJobs,
  createJob,
  updateJob,
  reorderJob,
} from "../utils/api";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showJobForm, setShowJobForm] = useState(false); // New state for modal
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

  // ✅ Create a new job - UPDATED
  const addJob = async (jobData) => {
    try {
      const newJob = {
        ...jobData,
        slug: jobData.title.toLowerCase().replace(/\s+/g, "-"),
        status: "active",
      };
      const created = await createJob(newJob);
      setJobs((prev) => [...prev, created]);
    } catch (err) {
      console.error("Failed to add job:", err);
      setError("Unable to create job.");
    }
  };

  // Rest of your existing functions remain the same...
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

  const moveCard = async (fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;

    const reordered = [...jobs];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);
    setJobs(reordered);

    try {
      await reorderJob(moved.id, { 
        fromOrder: fromIndex + 1, 
        toOrder: toIndex + 1 
      });
    } catch (err) {
      console.error("Reorder failed:", err);
      setError("Reordering failed (simulated 500 possible).");
    }
  };

  const handleJobClick = (id) => {
    navigate(`/jobs/${id}/`);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Manage Jobs</h2>
          <button
            onClick={() => setShowJobForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center gap-2"
          >
            <span>+</span>
            Add Job
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {loading && (
          <div className="text-center text-gray-500 py-8">
            <p>Loading jobs...</p>
          </div>
        )}

        <JobList
          jobs={jobs}
          onArchive={toggleArchive}
          onMove={moveCard}
          onClick={handleJobClick}
          moveCard={moveCard}
        />

        {/* Job Form Modal */}
        <JobForm
          onAdd={addJob}
          isOpen={showJobForm}
          onClose={() => setShowJobForm(false)}
        />
      </div>
    </DndProvider>
  );
}