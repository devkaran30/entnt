import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllAssessments } from "../utils/api/assessments";

export default function AssessmentsPage() {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);

  async function loadAll() {
    try {
      setLoading(true);
      setError("");
      const data = await getAllAssessments({ search, page, pageSize });
      setAssessments(Array.isArray(data.items) ? data.items : []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error("Failed to load all assessments:", err);
      setError("Failed to load assessments");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page]);

  const totalPages = Math.ceil(total / pageSize);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // reset to first page on new search
  };

  if (loading) return <p className="p-4">Loading assessments...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">All Assessments</h2>

      {/* 🔍 Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by title or job ID..."
          value={search}
          onChange={handleSearchChange}
          className="border rounded-lg px-3 py-2 w-full sm:w-1/2"
        />
      </div>

      {assessments.length === 0 ? (
        <p>No assessments available.</p>
      ) : (
        <ul className="space-y-3">
          {assessments.map((a) => (
            <li
              key={a.jobId}
              className="border rounded-lg p-3 flex justify-between items-center hover:bg-gray-50"
            >
              <div>
                <h3 className="font-medium text-lg">{a.title || a.jobTitle}</h3>
                <p className="text-sm text-gray-600">Job ID: {a.jobId}</p>
                <p className="text-sm text-gray-600">
                  Questions: {a.questions?.length || 0}
                </p>
              </div>
              <Link
                to={`/assessments/${a.jobId}`}
                className="text-blue-600 hover:underline"
              >
                View Details →
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* 📄 Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            ← Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
