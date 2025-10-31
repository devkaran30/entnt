import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableWrapper({ id, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  // Use translate3d string so browser GPU-accelerates movement
  const transformStyle = CSS.Transform.toString(transform);

  const style = {
    display: "block",       // important so measurements match grid cell
    width: "100%",          // each item occupies its grid column fully
    transform: transformStyle,
    transition,
    zIndex: isDragging ? 50 : "auto",
    opacity: isDragging ? 0.85 : 1,
    boxShadow: isDragging ? "0 8px 24px rgba(0,0,0,0.12)" : undefined,
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}
