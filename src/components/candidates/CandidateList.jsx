import React from "react";

export default function CandidateList({ candidates, nextStage, updatingId }) {
  if (candidates.length === 0)
    return <p className="text-gray-500">No candidates yet.</p>;

  return (
    <ul className="space-y-2">
      {candidates.map((c) => (
        <li
          key={c.id}
          className="bg-green-50 shadow p-3 rounded-lg flex justify-between items-center"
        >
          <div>
            <span className="font-medium">{c.name}</span> →{" "}
            <span className="text-blue-600">{c.job}</span>
            <div className="text-sm text-gray-500">Stage: {c.stage}</div>
          </div>
          {c.stage !== "Hired" && (
            <button
              onClick={() => nextStage(c.id)}
              disabled={updatingId === c.id}
              className={`px-3 py-1 rounded text-white ${
                updatingId === c.id
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {updatingId === c.id ? "Moving..." : "Next Stage"}
            </button>
          
          )}
        </li>
      ))}
    </ul>
  );
}
