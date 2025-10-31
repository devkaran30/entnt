import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCandidateById, updateCandidate } from "../utils/api/candidates";

export default function CandidateDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  const stages = ["Applied", "Interview", "Hired"];

  useEffect(() => {
    fetchCandidate();
  }, [id]);

  const fetchCandidate = async () => {
    try {
      setLoading(true);
      const data = await getCandidateById(id);
      setCandidate(data);
    } catch (err) {
      console.error("Failed to fetch candidate:", err);
      if (err.status === 404) {
        setError("Candidate not found");
      } else {
        setError("Failed to load candidate details");
      }
    } finally {
      setLoading(false);
    }
  };

  const updateStage = async (newStage) => {
    setUpdating(true);
    try {
      const updated = await updateCandidate(id, { stage: newStage });
      setCandidate(updated);
    } catch (err) {
      console.error("Failed to update candidate:", err);
      alert("Failed to update candidate stage");
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Not available";
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading candidate details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          <p className="text-lg">{error}</p>
          <button
            onClick={() => navigate("/candidates")}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Candidates
          </button>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Candidate not found</p>
          <button
            onClick={() => navigate("/candidates")}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Candidates
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate("/candidates")}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Candidates
      </button>

      {/* Candidate Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {candidate.name}
              </h1>
              <p className="text-lg text-gray-600 mb-4">{candidate.email}</p>
              
              {/* Stage Badge */}
              <div className="inline-flex items-center">
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                  candidate.stage === "Applied" 
                    ? "bg-blue-100 text-blue-800 border border-blue-200"
                    : candidate.stage === "Interview"
                    ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                    : "bg-green-100 text-green-800 border border-green-200"
                }`}>
                  {candidate.stage}
                </span>
              </div>
            </div>
            
            {/* Candidate ID */}
            <div className="mt-4 lg:mt-0 lg:text-right">
              <p className="text-sm text-gray-500">Candidate ID</p>
              <p className="text-gray-700 font-mono text-sm">{candidate.id}</p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8">
          {/* Stage Progress */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Hiring Progress</h2>
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              {stages.map((stage, index) => (
                <React.Fragment key={stage}>
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 ${
                      stages.indexOf(candidate.stage) >= index
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "bg-white border-gray-300 text-gray-400"
                    }`}>
                      {index + 1}
                    </div>
                    <span className={`text-sm mt-3 font-medium text-center ${
                      stages.indexOf(candidate.stage) >= index
                        ? "text-blue-600"
                        : "text-gray-400"
                    }`}>
                      {stage}
                    </span>
                  </div>
                  {index < stages.length - 1 && (
                    <div className={`flex-1 h-1 mx-2 ${
                      stages.indexOf(candidate.stage) > index
                        ? "bg-blue-600"
                        : "bg-gray-300"
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Stage Control */}
          <div className="border-t border-gray-200 pt-8 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Stage</h3>
            <div className="flex items-center gap-4 max-w-md">
              <select
                value={candidate.stage}
                onChange={(e) => updateStage(e.target.value)}
                disabled={updating}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                {stages.map((stage) => (
                  <option key={stage} value={stage}>
                    {stage}
                  </option>
                ))}
              </select>
              {updating && (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              )}
            </div>
          </div>

          {/* Candidate Information */}
          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Candidate Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Full Name
                  </label>
                  <p className="text-gray-900 font-medium">{candidate.name}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Email Address
                  </label>
                  <p className="text-gray-900 break-all">{candidate.email}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Created Date
                  </label>
                  <p className="text-gray-900">{formatDate(candidate.createdAt)}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Current Status
                  </label>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      candidate.stage === "Applied" 
                        ? "bg-blue-500"
                        : candidate.stage === "Interview"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}></div>
                    <span className="text-gray-900 font-medium">{candidate.stage}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Section */}
          <div className="border-t border-gray-200 pt-8 mt-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Application Timeline</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-3 h-3 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">Candidate Applied</p>
                  <p className="text-gray-500 text-sm">{formatDate(candidate.createdAt)}</p>
                  <p className="text-gray-600 mt-1">Candidate entered the hiring pipeline</p>
                </div>
              </div>
              
              {candidate.stage === "Interview" || candidate.stage === "Hired" ? (
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-3 h-3 bg-yellow-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">Moved to Interview Stage</p>
                    <p className="text-gray-500 text-sm">Date not available</p>
                    <p className="text-gray-600 mt-1">Candidate progressed to interview phase</p>
                  </div>
                </div>
              ) : null}
              
              {candidate.stage === "Hired" ? (
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-3 h-3 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">Hired</p>
                    <p className="text-gray-500 text-sm">Date not available</p>
                    <p className="text-gray-600 mt-1">Candidate successfully hired</p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}