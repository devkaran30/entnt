import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getAssessment,
  saveAssessment,
  submitAssessment,
} from "../utils/api/assessments";
import AssessmentBuilder from "../components/assessments/AssessmentForm";
import AssessmentPreview from "../components/assessments/AssessmentPreview";

export default function AssessmentDetailPage() {
  const { jobId } = useParams();
  const [assessment, setAssessment] = useState(null);
  const [activeTab, setActiveTab] = useState("builder");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => {
    if (!jobId) return;

    async function load() {
      try {
        setLoading(true);
        setError("");
        const data = await getAssessment(jobId);
        setAssessment(data || { jobId, title: "", sections: [] });
      } catch (err) {
        console.error("Failed to load assessment:", err);
        setError("Failed to load assessment");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [jobId]);

  const handleSave = async (updated) => {
    try {
      setAssessment(updated);
      await saveAssessment(jobId, updated);
      localStorage.setItem(`assessment-${jobId}`, JSON.stringify(updated));
      setSaveStatus("Saved successfully!");
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (err) {
      console.error("Failed to save:", err);
      setError("Save failed");
      setSaveStatus("Save failed!");
    }
  };

  const handleSubmit = async (responses) => {
    try {
      await submitAssessment(jobId, {
        candidateId: "demo-candidate",
        responses,
      });
      alert("Assessment submitted successfully!");
    } catch (err) {
      console.error("Submit failed:", err);
      setError("Submission failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-md w-full mx-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Loading assessment...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !assessment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Assessment</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalQuestions = assessment?.sections?.reduce(
    (total, section) => total + (section.questions?.length || 0),
    0
  ) || 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {assessment?.title || "Untitled Assessment"}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <span className="font-medium">Job ID:</span>
                  <span className="bg-gray-100 px-2 py-1 rounded-md font-mono">{jobId}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="font-medium">Sections:</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md">
                    {assessment?.sections?.length || 0}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="font-medium">Total Questions:</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md">
                    {totalQuestions}
                  </span>
                </div>
              </div>
            </div>

            {/* Status and Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              {saveStatus && (
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  saveStatus.includes("failed") 
                    ? "bg-red-100 text-red-800" 
                    : "bg-green-100 text-green-800"
                }`}>
                  {saveStatus}
                </div>
              )}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab("builder")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === "builder"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  🛠️ Builder
                </button>
                <button
                  onClick={() => setActiveTab("preview")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === "preview"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  👁️ Preview
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {activeTab === "builder" ? (
            <AssessmentBuilder assessment={assessment} onSave={handleSave} />
          ) : (
            <AssessmentPreview assessment={assessment} onSubmit={handleSubmit} />
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-red-400">⚠️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}