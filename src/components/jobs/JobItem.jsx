import React, { useState } from "react";

export default function JobCard({
  job,
  index,
  total,
  onArchive,
  onMove,
  onEdit,
  onClick,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(job.title);

  const handleSave = () => {
    if (!editTitle.trim()) return;
    onEdit(job.id, editTitle);
    setIsEditing(false);
  };

  const stop = (e) => e.stopPropagation();

  return (
    <div
      onClick={() => onClick?.(job.id)}
      className={`p-5 rounded-2xl shadow-md border transition cursor-pointer hover:shadow-lg ${
        job.status === "archived"
          ? "bg-gray-100 border-gray-300 hover:bg-gray-200"
          : "bg-white border-blue-200 hover:bg-blue-50"
      }`}
    >
      {/* Header Section */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          {isEditing ? (
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onClick={stop}
              className="border rounded-lg px-2 py-1 w-full focus:outline-blue-500"
            />
          ) : (
            <h3 className="text-lg font-semibold text-gray-800">
              {job.title}
              {job.status === "archived" && (
                <span className="text-sm text-gray-500 font-normal ml-1">
                  (Archived)
                </span>
              )}
            </h3>
          )}
          <p className="text-sm text-gray-500">{job.slug}</p>
        </div>

        <div className="flex gap-2" onClick={stop}>
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="text-green-600 text-sm hover:underline"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="text-gray-600 text-sm hover:underline"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-600 text-sm hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => onArchive(job.id)}
                className="text-purple-600 text-sm hover:underline"
              >
                {job.status === "archived" ? "Unarchive" : "Archive"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Job Description */}
      <p className="text-sm text-gray-700 mb-3 line-clamp-2">
        {job.description}
      </p>

      {/* Job Meta Info */}
      <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
        <span className="flex items-center gap-1">
          📍 <span>{job.location || "N/A"}</span>
        </span>
        <span className="flex items-center gap-1">
          💼 <span>{job.workType || "On-site"}</span>
        </span>
        <span className="flex items-center gap-1">
          💰 <span>{job.salary || "Not Disclosed"}</span>
        </span>
      </div>

      {/* Tags */}
      {job.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {job.tags.map((tag, i) => (
            <span
              key={i}
              className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      {/* <div className="flex justify-end gap-2 mt-2" onClick={stop}>
        {index > 0 && (
          <button
            onClick={() => onMove(index, -1)}
            className="text-gray-600 hover:text-gray-800"
            title="Move up"
          >
            ⬆️
          </button>
        )}
        {index < total - 1 && (
          <button
            onClick={() => onMove(index, 1)}
            className="text-gray-600 hover:text-gray-800"
            title="Move down"
          >
            ⬇️
          </button>
        )}
      </div> */}
    </div>
  );
}
