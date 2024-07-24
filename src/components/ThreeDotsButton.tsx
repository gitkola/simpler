import React, { useState, useRef, useEffect } from 'react';
import { Folder, ThreeDotsIcon, Trash } from './Icons';
import { ProjectPathListItem } from "../types";

export const ThreeDotsButton: React.FC<{
  projectPath: ProjectPathListItem | null,
  onDeleteProject: (projectPath: string | null) => void,
  onOpenProjectFolder: (projectPath: string | null) => void;
  className?: string;
}> = ({
  projectPath,
  onDeleteProject,
  onOpenProjectFolder,
  className,
}) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsPopoverOpen(false);
      }
    };

    useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    return (
      <div className="relative">
        <button onClick={(e) => {
          e.nativeEvent.preventDefault();
          setIsPopoverOpen(!isPopoverOpen)
        }
        }
          className={className ? className : "flex items-center justify-center w-14 h-[40px] px-4 py-2 hover:bg-gray-300"}>
          <ThreeDotsIcon size={24} />
        </button>
        {isPopoverOpen && (
          <div ref={popoverRef} className="absolute overflow-hidden right-2 top-2 bg-white shadow-md shadow-gray-600 rounded-md z-10">
            <button
              onClick={() => {
                onOpenProjectFolder(projectPath);
                setIsPopoverOpen(!isPopoverOpen);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
            >
              <Folder size={16} className="mr-2" />
              Open
            </button>
            <button
              onClick={() => {
                onDeleteProject(projectPath);
                setIsPopoverOpen(!isPopoverOpen);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-gray-200"
            >
              <Trash size={16} className="mr-2" />
              Delete
            </button>
          </div>
        )}
      </div>
    );
  };

