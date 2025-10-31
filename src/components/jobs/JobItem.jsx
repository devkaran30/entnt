import React from "react";
import { useDrag, useDrop } from "react-dnd";

export default function JobCard({
  job,
  index,
  total,
  onArchive,
  onMove,
  onClick,
  moveCard,
}) {
  // Drag functionality
  const [{ isDragging }, drag] = useDrag({
    type: "job",
    item: { id: job.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Drop functionality
  const [, drop] = useDrop({
    accept: "job",
    hover: (draggedItem) => {
      if (draggedItem.id !== job.id) {
        moveCard(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const dragDropRef = (node) => {
    drag(node);
    drop(node);
  };

  const stop = (e) => e.stopPropagation();

  return (
    <div
      ref={dragDropRef}
      onClick={() => onClick?.(job.id)}
      className={`p-5 rounded-2xl shadow-md border transition cursor-move hover:shadow-lg ${
        job.status === "archived"
          ? "bg-gray-100 border-gray-300 hover:bg-gray-200"
          : "bg-white border-blue-200 hover:bg-blue-50"
      } ${isDragging ? "opacity-50" : "opacity-100"}`}
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
    >
      {/* Header Section */}
      <div className="flex justify-between items-start mb-3 gap-2">
        <div className="flex-1 flex items-start gap-2 min-w-0"> {/* Added min-w-0 */}
          {/* Drag handle icon */}
          <div className="text-gray-400 mt-1 cursor-grab active:cursor-grabbing flex-shrink-0">
            ⠿
          </div>
          <div className="flex-1 min-w-0"> {/* Added min-w-0 */}
            <h3 className="text-lg font-semibold text-gray-800 truncate leading-tight"> {/* Added leading-tight */}
              {job.title}
              {job.status === "archived" && (
                <span className="text-sm text-gray-500 font-normal ml-1 whitespace-nowrap">
                  (Archived)
                </span>
              )}
            </h3>
            <p className="text-sm text-gray-500 truncate mt-1">{job.slug}</p>
          </div>
        </div>

        <div className="flex gap-2 flex-shrink-0" onClick={stop}>
          <button
            onClick={() => onArchive(job.id, job.status)}
            className="text-purple-600 text-sm hover:underline whitespace-nowrap px-2 py-1 rounded hover:bg-purple-50 transition-colors"
          >
            {job.status === "archived" ? "Unarchive" : "Archive"}
          </button>
        </div>
      </div>

      {/* Job Description */}
      <p className="text-sm text-gray-700 mb-3 line-clamp-2 leading-relaxed break-words"> {/* Added break-words */}
        {job.description || "No description provided."}
      </p>

      {/* Job Meta Info - Improved layout */}
      <div className="space-y-2 mb-3">
        <div className="flex flex-col gap-2 text-sm text-gray-600"> {/* Changed to flex-col */}
          {/* Location with better handling */}
          <div className="flex items-center gap-2">
            <span className="flex-shrink-0">📍</span>
            <span className="truncate break-all min-w-0"> {/* Added break-all and min-w-0 */}
              {job.location || "N/A"}
            </span>
          </div>
          
          {/* Work Type with better handling */}
          <div className="flex items-center gap-2">
            <span className="flex-shrink-0">💼</span>
            <span className="truncate break-all min-w-0"> {/* Added break-all and min-w-0 */}
              {job.workType || "On-site"}
            </span>
          </div>
          
          {/* Salary with better handling */}
          <div className="flex items-center gap-2">
            <span className="flex-shrink-0">💰</span>
            <span className="truncate break-all min-w-0 font-medium text-gray-700"> {/* Added break-all and min-w-0 */}
              {job.salary || "Not Disclosed"}
            </span>
          </div>
        </div>
      </div>

      {/* Tags - Improved with better overflow handling */}
      {job.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {job.tags.slice(0, 3).map((tag, i) => ( // Limit to 3 tags
            <span
              key={i}
              className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full break-words max-w-full truncate" // Added break-words and max-w-full
              title={tag} // Add title for hover tooltip
            >
              {tag}
            </span>
          ))}
          {job.tags.length > 3 && (
            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
              +{job.tags.length - 3} more
            </span>
          )}
        </div>
      )}
    </div>
  );
}