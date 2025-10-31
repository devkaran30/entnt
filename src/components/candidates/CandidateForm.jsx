import React, { useState } from "react";

export default function CandidateForm({ addCandidate }) {
  const [name, setName] = useState("");
  const [job, setJob] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !job) return;
    addCandidate(name, job);
    setName("");
    setJob("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-2 mb-4"
    >
      <input
        placeholder="Candidate name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border rounded-lg px-3 py-2 flex-1 focus:outline-blue-500"
      />
      <input
        placeholder="Job applied for"
        value={job}
        onChange={(e) => setJob(e.target.value)}
        className="border rounded-lg px-3 py-2 flex-1 focus:outline-blue-500"
      />
      <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
        Add
      </button>
    </form>
  );
}
