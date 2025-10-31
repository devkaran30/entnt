import React from "react";

export default function AssessmentList({ assessments, updateAnswer }) {
  if (assessments.length === 0)
    return <p className="text-gray-500">No assessments created yet.</p>;

  return (
    <ul className="space-y-2">
      {assessments.map((a) => (
        <li
          key={a.id}
          className="bg-purple-50 p-3 shadow rounded-lg flex flex-col gap-2"
        >
          <div>
            <b>{a.job}</b> — {a.question}
          </div>
          <input
            placeholder="Candidate's answer"
            value={a.answer}
            onChange={(e) => updateAnswer(a.id, e.target.value)}
            className="border rounded-lg px-3 py-2 focus:outline-purple-500"
          />
        </li>
      ))}
    </ul>
  );
}
