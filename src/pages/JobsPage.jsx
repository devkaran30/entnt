import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import JobForm from "../components/jobs/JobForm";
import JobList from "../components/jobs/JobList";
import {
  getJobs,
  createJob,
  updateJob,
  reorderJob,
} from "../utils/api";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showJobForm, setShowJobForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // "all", "active", "archived"
  const navigate = useNavigate();

  // ✅ Load jobs from API
  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true);
        const data = await getJobs();
        setJobs(data || []);
        setFilteredJobs(data || []);
      } catch (err) {
        console.error("Failed to load jobs:", err);
        setError("Unable to load jobs.");
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  // ✅ Filter jobs based on search term and status
  useEffect(() => {
    let results = jobs;

    // Apply status filter
    if (statusFilter !== "all") {
      results = results.filter(job => job.status === statusFilter);
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const lowercasedSearch = searchTerm.toLowerCase().trim();
      results = results.filter(job => {
        const searchableFields = [
          job.title || "",
          job.company || "",
          job.location || "",
          job.description || "",
          job.requirements || "",
          job.slug || ""
        ];

        return searchableFields.some(field => 
          field.toLowerCase().includes(lowercasedSearch)
        );
      });
    }

    setFilteredJobs(results);
  }, [searchTerm, statusFilter, jobs]);

  // ✅ Create a new job
  const addJob = async (jobData) => {
    try {
      const newJob = {
        ...jobData,
        slug: jobData.title.toLowerCase().replace(/\s+/g, "-"),
        status: "active",
      };
      const created = await createJob(newJob);
      setJobs((prev) => [...prev, created]);
      setShowJobForm(false);
    } catch (err) {
      console.error("Failed to add job:", err);
      setError("Unable to create job.");
    }
  };

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

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Jobs</h1>
              <p className="text-gray-600">Create, organize, and manage your job postings</p>
            </div>
            <button
              onClick={() => setShowJobForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center gap-2 w-full lg:w-auto justify-center"
            >
              <span>+</span>
              Add New Job
            </button>
          </div>

          {/* Search and Filter Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Search Input */}
              <div>
                <label htmlFor="job-search" className="block text-sm font-medium text-gray-700 mb-2">
                  Search Jobs
                </label>
                <div className="relative">
                  <input
                    id="job-search"
                    type="text"
                    placeholder="Search by title, company, location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400">🔍</span>
                  </div>
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Status
                </label>
                <div className="flex items-center space-x-4">
                  <select
                    id="status-filter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="all">All Jobs</option>
                    <option value="active">Active Only</option>
                    <option value="archived">Archived Only</option>
                  </select>
                  
                  {(searchTerm || statusFilter !== "all") && (
                    <button
                      onClick={clearFilters}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-3 rounded-lg font-medium transition-colors whitespace-nowrap"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Search Results Info */}
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing <span className="font-medium">{filteredJobs.length}</span> of{" "}
                <span className="font-medium">{jobs.length}</span> jobs
                {(searchTerm || statusFilter !== "all") && (
                  <span className="ml-2 text-blue-600">(filtered)</span>
                )}
              </p>
              
              {filteredJobs.length === 0 && jobs.length > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Clear filters to see all jobs
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
              <div className="flex items-center">
                <span className="mr-2">⚠️</span>
                <span>{error}</span>
              </div>
            </div>
          )}
          
          {loading && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-gray-600 text-lg">Loading jobs...</p>
              </div>
            </div>
          )}

          {/* Jobs List */}
          {!loading && (
            <>
              {filteredJobs.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">💼</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {jobs.length === 0 ? "No Jobs Yet" : "No Jobs Found"}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {jobs.length === 0 
                      ? "Get started by creating your first job posting." 
                      : "No jobs match your current search criteria. Try adjusting your filters."
                    }
                  </p>
                  {jobs.length === 0 && (
                    <button
                      onClick={() => setShowJobForm(true)}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Create Your First Job
                    </button>
                  )}
                </div>
              ) : (
                <JobList
                  jobs={filteredJobs}
                  onArchive={toggleArchive}
                  onMove={moveCard}
                  onClick={handleJobClick}
                  moveCard={moveCard}
                />
              )}
            </>
          )}

          {/* Job Form Modal */}
          <JobForm
            onAdd={addJob}
            isOpen={showJobForm}
            onClose={() => setShowJobForm(false)}
          />
        </div>
      </div>
    </DndProvider>
  );
}