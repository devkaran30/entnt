import React from "react";
import JobItem from "./JobItem";

export default function JobList({ jobs, onArchive, onMove, onClick, moveCard }) {
  if (jobs.length === 0) {
    return <p className="text-gray-500">No jobs added yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 min-w-0"> {/* Added min-w-0 */}
      {jobs.map((job, i) => (
        <JobItem
          key={job.id}
          job={job}
          index={i}
          total={jobs.length}
          onMove={onMove}
          onArchive={onArchive}
          onClick={onClick}
          moveCard={moveCard}
        />
      ))}
    </div>
  );
}