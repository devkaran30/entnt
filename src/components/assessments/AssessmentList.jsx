import React from "react";

export default function AssessmentList({ assessments, updateAnswer }) {
  if (assessments.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">📋</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Assessments</h3>
        <p className="text-gray-600">No assessments have been created yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {assessments.map((a) => (
        <div
          key={a.id}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg mb-1">{a.job}</h3>
              <p className="text-gray-600 text-sm line-clamp-2">{a.question}</p>
            </div>
            <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full font-medium">
              Assessment
            </span>
          </div>

          {/* Answer Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Candidate's Answer
            </label>
            <textarea
              placeholder="Enter candidate's response..."
              value={a.answer}
              onChange={(e) => updateAnswer(a.id, e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-vertical"
              rows="3"
            />
          </div>

          {/* Metadata */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <span className="text-xs text-gray-500">
              {new Date(a.createdAt || Date.now()).toLocaleDateString()}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              a.answer 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {a.answer ? 'Answered' : 'Pending'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}