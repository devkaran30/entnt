import React, { useState, useEffect } from "react";
import CandidateForm from "../components/candidates/CandidateForm";
import CandidateList from "../components/candidates/CandidateList";
import {
  getCandidates,
  createCandidate,
  updateCandidate,
} from "../utils/api/candidates";

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchCandidates(page, pageSize);
  }, [page, pageSize]);

  const fetchCandidates = async (pageNum = 1, size = 20) => {
    try {
      setLoading(true);
      const data = await getCandidates({ page: pageNum, pageSize: size });
      const newItems = data?.items || [];
      const total = data?.total || 0;

      setCandidates(newItems);
      setHasPrev(pageNum > 1);
      setHasNext(pageNum * size < total);
    } catch (err) {
      console.error(err);
      setError("Failed to load candidates");
    } finally {
      setLoading(false);
    }
  };

  const addCandidate = async (name, job) => {
    try {
      const newCandidate = await createCandidate({
        name,
        jobId: job,
        stage: "Applied",
      });
      // Reload first page after adding
      setPage(1);
    } catch (err) {
      console.error("Failed to add candidate:", err);
      alert("Failed to add candidate");
    }
  };

  const nextStage = async (id) => {
    const stages = ["Applied", "Interview", "Hired"];
    const candidate = candidates.find((c) => c.id === id);
    if (!candidate) return;

    const currentIndex = stages.indexOf(candidate.stage);
    if (currentIndex === -1 || currentIndex === stages.length - 1) return;

    const next = stages[currentIndex + 1];
    setUpdatingId(id);

    try {
      const updated = await updateCandidate(id, { stage: next });
      setCandidates((prev) =>
        prev.map((c) => (c.id === id ? { ...c, stage: updated.stage } : c))
      );
    } catch (err) {
      console.error("Failed to update candidate:", err);
      alert("Failed to update candidate stage");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading)
    return <p className="text-gray-500 text-center">Loading candidates...</p>;
  if (error)
    return <p className="text-red-600 text-center">{error}</p>;

  return (
    <div>
      <CandidateForm addCandidate={addCandidate} />

      <CandidateList
        candidates={candidates}
        nextStage={nextStage}
        updatingId={updatingId}
      />

      {/* Pagination Controls */}
      <div className="flex flex-col items-center mt-6 gap-3">
        {/* Page size selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="pageSize" className="text-gray-700 font-medium">
            Items per page:
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1); // Reset to first page when page size changes
            }}
            className="border border-gray-300 rounded px-2 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        {/* Prev/Next Buttons */}
        <div className="flex justify-center items-center gap-3 mt-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={!hasPrev}
            className={`px-4 py-2 rounded text-white ${
              hasPrev
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Previous
          </button>

          <span className="px-3 py-2 text-gray-700">Page {page}</span>

          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!hasNext}
            className={`px-4 py-2 rounded text-white ${
              hasNext
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
