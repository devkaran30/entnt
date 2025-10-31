import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getJobById } from "../utils/api/jobs";
import { getApplicationsByJobId } from "../utils/api/applications";

export default function JobDetailPage() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [applicationCount, setApplicationCount] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const [jobData, applications] = await Promise.all([
          getJobById(jobId),
          getApplicationsByJobId(jobId),
        ]);

        setJob(jobData);
        setApplicationCount(applications.length);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  if (error) {
    return (
      <div className="text-center text-red-600">
        <p>⚠️ {error}</p>
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
    <div className="p-4">
      <Link
        to="/jobs"
        className="text-blue-600 hover:underline text-sm mb-4 inline-block"
      >
        ← Back to Jobs
      </Link>

      <h2 className="text-2xl font-bold text-blue-700 mb-2">{job.title}</h2>
      <p className="text-gray-600 mb-4">{job.description}</p>

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-800">
        <p><strong>Salary:</strong> {job.salary}</p>
        <p><strong>Work Type:</strong> {job.workType}</p>
        <p><strong>Location:</strong> {job.location}</p>
        <p><strong>Status:</strong> {job.status}</p>
      </div>

      <div className="mt-4">
        <strong>Tags:</strong>{" "}
        {job.tags?.length ? (
          job.tags.map((tag) => (
            <span
              key={tag}
              className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs mr-2"
            >
              {tag}
            </span>
          ))
        ) : (
          <span className="text-gray-500">No tags</span>
        )}
      </div>

      <div className="mt-6 bg-gray-50 border rounded-lg p-3">
        <p className="text-sm text-gray-700">
          <strong>Total Applications:</strong>{" "}
          <span className="text-blue-700 font-semibold">{applicationCount}</span>
        </p>
      </div>
    </div>
  );
}
