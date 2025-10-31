import React, { useEffect, useState } from "react";
import JobItem from "./JobItem";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  rectIntersection, // ADD THIS IMPORT
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates, // ADD THIS IMPORT
} from "@dnd-kit/sortable";
import SortableWrapper from "./SortableWrapper";

export default function JobList({
  jobs: externalJobs,
  setJobs: setExternalJobs,
  onArchive,
  onMove,
  onEdit,
  onClick,
}) {
  const [jobs, setJobs] = useState(externalJobs ?? []);

  useEffect(() => {
    setJobs(externalJobs ?? []);
  }, [externalJobs]);

  // ENHANCED sensors configuration
  const sensors = useSensors(
    useSensor(PointerSensor, { 
      activationConstraint: { 
        distance: 8, // INCREASED from 5 for better reliability
      } 
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates, // ADD THIS
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    // ADD DEBUG LOGS
    console.log('Drag end - Active:', active?.id, 'Over:', over?.id);
    
    if (!over) {
      console.log('No drop target found');
      return;
    }
    
    if (active.id === over.id) {
      console.log('Dropped on same element');
      return;
    }

    const oldIndex = jobs.findIndex((j) => j.id === active.id);
    const newIndex = jobs.findIndex((j) => j.id === over.id);

    console.log('Indices - Old:', oldIndex, 'New:', newIndex);

    if (oldIndex === -1 || newIndex === -1) {
      console.log('Invalid indices found');
      return;
    }

    const reordered = arrayMove(jobs, oldIndex, newIndex);

    // Update local and inform parent
    setJobs(reordered);
    setExternalJobs?.(reordered);
    onMove?.(oldIndex, newIndex);
    
    console.log('Reordered successfully');
  };

  if (!jobs || jobs.length === 0) {
    return <p className="text-gray-500">No jobs added yet.</p>;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection} // CHANGED from closestCenter - better for grids
      onDragEnd={handleDragEnd}
      onDragStart={() => console.log('Drag started')} // ADD for debugging
      onDragCancel={() => console.log('Drag cancelled')} // ADD for debugging
    >
      <SortableContext
        items={jobs.map((j) => j.id)}
        strategy={rectSortingStrategy}
      >
        {/* ADD position: relative to grid container */}
        <div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          style={{ position: 'relative' }} // ADD THIS STYLE
        >
          {jobs.map((job, i) => (
            <SortableWrapper key={job.id} id={job.id}>
              <JobItem
                job={job}
                index={i}
                total={jobs.length}
                onEdit={onEdit}
                onMove={onMove}
                onArchive={onArchive}
                onClick={onClick}
              />
            </SortableWrapper>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}