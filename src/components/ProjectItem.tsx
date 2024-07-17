import React, { useState, useRef, useEffect } from 'react';
import { Folder, ThreeDotsIcon, Trash } from './Icons';
import { ProjectPathListItem } from "../types";
import { getFolderNameFromPath } from '../utils/getFolderNameFromPath';

const ProjectItem: React.FC<{
  projectPath: ProjectPathListItem,
  onSelectProject: (projectPath: string) => void,
  onDeleteProject: (projectPath: string) => void,
  onOpenProjectFolder: (projectPath: string) => void
}> = ({
  projectPath,
  onSelectProject,
  onDeleteProject,
  onOpenProjectFolder
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
      <button
        onClick={() => onSelectProject(projectPath)}
        className={`flex justify-between items-center overflow-visible whitespace-nowrap text-ellipsis w-64 h-[40px] pl-4 py-2 text-sm`}
      >
        <div className="flex items-center max-w-48 overflow-x-hidden">
          {getFolderNameFromPath(projectPath)}
        </div>
        <div className="relative">
          <button onClick={() => setIsPopoverOpen(!isPopoverOpen)} className="flex items-center justify-center w-14 h-[40px] px-4 py-2 hover:bg-gray-400">
            <ThreeDotsIcon size={24} />
          </button>
          {isPopoverOpen && (
            <div ref={popoverRef} className="absolute overflow-hidden right-2 -top-0 bg-white shadow-lg shadow-black rounded-md z-10">
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
      </button>

    );
  };

export default ProjectItem;
