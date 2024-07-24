import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from "../store";
import { RootState } from '../store';
import { setProjectStateViewWidth } from '../store/layoutSlice';

interface ResizablePanelProps {
  left: React.ReactNode;
  right: React.ReactNode;
  initialLeftWidth?: number;
  minLeftWidth?: number;
  maxLeftWidth?: number;
}

const ResizablePanel: React.FC<ResizablePanelProps> = ({
  left,
  right,
  minLeftWidth = 300,
  maxLeftWidth = 1600
}) => {
  const dispatch = useAppDispatch();
  const { projectStateViewWidth } = useAppSelector((state: RootState) => state.layout);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        const containerRect = containerRef.current?.getBoundingClientRect();
        if (containerRect) {
          const newLeftWidth = e.clientX - containerRect.left;
          if (newLeftWidth >= minLeftWidth && newLeftWidth <= maxLeftWidth) {
            dispatch(setProjectStateViewWidth(newLeftWidth));
          }
        }
      }
    },
    [isDragging, minLeftWidth, maxLeftWidth]
  );

  useEffect(() => {
    const handleMouseUpOutside = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUpOutside);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUpOutside);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUpOutside);
    };
  }, [isDragging, handleMouseMove]);

  return (
    <div ref={containerRef} className="flex h-full relative">
      <div style={{ width: projectStateViewWidth, minWidth: minLeftWidth, maxWidth: maxLeftWidth }} className="flex-shrink-0">
        {left}
      </div>
      <div
        className="w-2 bg-gray-800 cursor-col-resize hover:bg-gray-700 transition-colors absolute h-full"
        style={{ left: projectStateViewWidth }}
        onMouseDown={handleMouseDown}
      />
      <div className="flex w-full">{right}</div>
      {isDragging && (
        <div className="fixed inset-0 z-50 select-none"
          onMouseUp={handleMouseUp}
          style={{ cursor: 'col-resize' }}
        />
      )}
    </div>
  );
};

export default ResizablePanel;