import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getJobById, updateJob } from "../utils/api/jobs";
import { getApplicationsByJobId } from "../utils/api/applications";

export default function JobDetailPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [applicationCount, setApplicationCount] = useState(0);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    salary: "",
    workType: "",
    location: "",
    tags: [],
    status: "active"
  });
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const [jobData, applications] = await Promise.all([
          getJobById(jobId),
          getApplicationsByJobId(jobId),
        ]);

        setJob(jobData);
        setEditForm({
          title: jobData.title || "",
          description: jobData.description || "",
          salary: jobData.salary || "",
          workType: jobData.workType || "On-site",
          location: jobData.location || "",
          tags: jobData.tags || [],
          status: jobData.status || "active"
        });
        setApplicationCount(applications.length);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  const handleSave = async () => {
    try {
      const updatedJob = await updateJob(jobId, {
        ...editForm,
        slug: editForm.title.toLowerCase().replace(/\s+/g, "-"),
      });
      
      setJob(updatedJob);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError("Failed to update job: " + err.message);
    }
  };

  const handleCancel = () => {
    setEditForm({
      title: job.title || "",
      description: job.description || "",
      salary: job.salary || "",
      workType: job.workType || "On-site",
      location: job.location || "",
      tags: job.tags || [],
      status: job.status || "active"
    });
    setIsEditing(false);
    setError(null);
  };

  const addTag = () => {
    if (newTag.trim() && !editForm.tags.includes(newTag.trim())) {
      setEditForm(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setEditForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTag();
    }
  };

  if (error && !isEditing) {
    return (
      <div className="text-center text-red-600">
        <p>⚠️ {error}</p>
        <Link to="/jobs" className="text-blue-600 hover:underline mt-4 inline-block">
          ← Back to Jobs
        </Link>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center text-gray-500">
        <p>Loading job details...</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <Link
          to="/jobs"
          className="text-blue-600 hover:underline text-sm inline-block"
        >
          ← Back to Jobs
        </Link>
        
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
          >
            Edit Job
          </button>
        )}
      </div>

      {error && isEditing && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {isEditing ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Job</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title *
              </label>
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter job title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                rows="4"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter job description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Salary
                </label>
                <input
                  type="text"
                  value={editForm.salary}
                  onChange={(e) => setEditForm(prev => ({ ...prev, salary: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 10-15 LPA"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Work Type
                </label>
                <select
                  value={editForm.workType}
                  onChange={(e) => setEditForm(prev => ({ ...prev, workType: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="On-site">On-site</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={editForm.location}
                  onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Bangalore, India"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add a tag"
                />
                <button
                  onClick={addTag}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {editForm.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={handleSave}
              disabled={!editForm.title.trim()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Save Changes
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        /* View Mode */
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-blue-700 mb-2">{job.title}</h2>
          <p className="text-gray-600 mb-6">{job.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-800 mb-6">
            <p><strong className="text-gray-700">Salary:</strong> {job.salary || "Not disclosed"}</p>
            <p><strong className="text-gray-700">Work Type:</strong> {job.workType || "On-site"}</p>
            <p><strong className="text-gray-700">Location:</strong> {job.location || "Not specified"}</p>
            <p><strong className="text-gray-700">Status:</strong> 
              <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {job.status}
              </span>
            </p>
          </div>

          <div className="mb-6">
            <strong className="text-gray-700">Tags:</strong>{" "}
            {job.tags?.length ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {job.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-gray-500 ml-2">No tags</span>
            )}
          </div>

          <div className="bg-gray-50 border rounded-lg p-4">
            <p className="text-sm text-gray-700">
              <strong>Total Applications:</strong>{" "}
              <span className="text-blue-700 font-semibold">{applicationCount}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}