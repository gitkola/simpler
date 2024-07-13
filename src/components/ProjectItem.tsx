import React, { useState, useRef, useEffect } from 'react';
import { Folder, ThreeDotsIcon, Trash } from './Icons';
import { ProjectPathListItem } from "../types";
import { getFolderNameFromPath } from '../utils/getFolderNameFromPath';

const ProjectItem: React.FC<{ projectPath: ProjectPathListItem, isActive: boolean, onSelectProject: (projectPath: string) => void, onDeleteProject: (projectPath: string) => void, onOpenProjectFolder: (projectPath: string) => void }> = ({ projectPath, isActive, onSelectProject, onDeleteProject, onOpenProjectFolder }) => {
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
    <div className="flex items-center justify-between mt-2">
      <button
        onClick={() => onSelectProject(projectPath)}
        className={`flex items-center w-full h-[40px] px-4 py-2 rounded-md text-sm ${isActive ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
      >
        {getFolderNameFromPath(projectPath)}
      </button>
      <div className="relative">
        <button onClick={() => setIsPopoverOpen(!isPopoverOpen)} className="h-[40px] px-4 py-2 ml-2 rounded-md hover:bg-gray-700">
          <ThreeDotsIcon size={16} />
        </button>
        {isPopoverOpen && (
          <div ref={popoverRef} className="absolute right-0 -mt-16 bg-white shadow-lg rounded-md z-10">
            <button
              onClick={() => {
                onDeleteProject(projectPath);
                setIsPopoverOpen(!isPopoverOpen);
              }}
              className="flex items-center w-full px-4 py-2 text-sm rounded-md text-red-700 hover:bg-gray-200"
            >
              <Trash size={16} className="mr-2" />
              Delete
            </button>
            <button
              onClick={() => {
                onOpenProjectFolder(projectPath);
                setIsPopoverOpen(!isPopoverOpen);
              }}
              className="flex items-center w-full px-4 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-200"
            >
              <Folder size={16} className="mr-2" />
              Open
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectItem;
