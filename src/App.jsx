// src/App.jsx
import React from "react";
import { Routes, Route, NavLink, Navigate } from "react-router-dom";

import JobsPage from "./pages/JobsPage";
import CandidatesPage from "./pages/CandidatesPage";
import AssessmentsPage from "./pages/AssessmentsPage";
import JobDetailPage from "./pages/JobDetail"
import AssessmentDetailPage from "./pages/AssessmentDetailPage";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
          TalentFlow
        </h1>

        {/* ✅ Navigation Tabs */}
        <div className="flex justify-center gap-4 mb-6">
          <NavLink
            to="/jobs"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg font-semibold transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`
            }
          >
            Jobs
          </NavLink>

          <NavLink
            to="/candidates"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg font-semibold transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`
            }
          >
            Candidates
          </NavLink>

          <NavLink
            to="/assessments"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg font-semibold transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`
            }
          >
            Assessments
          </NavLink>
        </div>

        {/* ✅ Page Routes */}
        <Routes>
          <Route path="/" element={<Navigate to="/jobs" replace />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:jobId" element={<JobDetailPage />} />
          <Route path="/candidates" element={<CandidatesPage />} />
          <Route path="/assessments" element={<AssessmentsPage />} />
          <Route path="/assessments/:jobId" element={<AssessmentDetailPage />} />
        </Routes>
      </div>
    </div>
  );
}
