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
    } catch (err) {
      console.error("Failed to save:", err);
      setError("Save failed");
    }
  };

  const handleSubmit = async (responses) => {
    try {
      await submitAssessment(jobId, {
        candidateId: "demo-candidate",
        responses,
      });
      alert("Assessment submitted!");
    } catch (err) {
      console.error("Submit failed:", err);
      setError("Submission failed");
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (error && !assessment) return <p className="p-4 text-red-600">{error}</p>;

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">
          {assessment?.title || "Untitled Assessment"}
        </h2>
        <div className="space-x-2">
          <button
            onClick={() => setActiveTab("builder")}
            className={`px-3 py-1 rounded ${
              activeTab === "builder"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            Builder
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`px-3 py-1 rounded ${
              activeTab === "preview"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            Preview
          </button>
        </div>
      </div>

      {activeTab === "builder" ? (
        <AssessmentBuilder assessment={assessment} onSave={handleSave} />
      ) : (
        <AssessmentPreview assessment={assessment} onSubmit={handleSubmit} />
      )}
    </div>
  );
}
