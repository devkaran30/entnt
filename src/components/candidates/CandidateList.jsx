import React from "react";

export default function CandidateList({ candidates, updateStage, updatingId, onCardClick }) {
  if (candidates.length === 0)
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No candidates found.</p>
        <p className="text-gray-400 mt-2">Add a candidate to get started.</p>
      </div>
    );

  const stages = ["Applied", "Interview", "Hired"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {candidates.map((candidate) => (
        <div
          key={candidate.id}
          onClick={() => onCardClick(candidate.id)}
          className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer hover:border-blue-300"
        >
          {/* Candidate Header */}
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-1">
              {candidate.name}
            </h3>
            <p className="text-blue-600 font-medium">{candidate.job}</p>
          </div>

          {/* Stage Info and Dropdown */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-gray-500">Current Stage:</span>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ml-2 ${
                candidate.stage === "Applied" 
                  ? "bg-blue-100 text-blue-800"
                  : candidate.stage === "Interview"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-green-100 text-green-800"
              }`}>
                {candidate.stage}
              </div>
            </div>

            {/* Stage Dropdown */}
            {candidate.stage !== "Hired" && (
              <div className="relative">
                <select
                  value={candidate.stage}
                  onChange={(e) => updateStage(candidate.id, e.target.value)}
                  disabled={updatingId === candidate.id}
                  onClick={(e) => e.stopPropagation()} // Prevent card click when interacting with dropdown
                  className={`appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    updatingId === candidate.id ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                  }`}
                >
                  {stages.map((stage) => (
                    <option 
                      key={stage} 
                      value={stage}
                      disabled={stages.indexOf(stage) < stages.indexOf(candidate.stage)}
                    >
                      {stage}
                    </option>
                  ))}
                </select>
                {updatingId === candidate.id && (
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Click hint */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center">
              Click card to view details
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}