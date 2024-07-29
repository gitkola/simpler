import { useState } from "react";
import { PanelResizeHandle } from "react-resizable-panels";

export default function PanelResizeHandler() {
  const [isDragging, setIsDragging] = useState(false);
  return (
    <PanelResizeHandle
      className={`w-0.5 bg-gray-800 hover:bg-blue-600 ${isDragging && 'bg-blue-600'}`}
      // onDragging={(isDragging) => setIsDragging(isDragging)}
      onFocus={() => setIsDragging(true)}
      onBlur={() => setIsDragging(false)}
    />
  );
}