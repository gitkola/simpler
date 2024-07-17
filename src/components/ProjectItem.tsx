import React from 'react';
import { ProjectPathListItem } from "../types";
import { getFolderNameFromPath } from '../utils/getFolderNameFromPath';
import { ThreeDotsButton } from './ThreeDotsButton';

const ProjectItem: React.FC<{
  projectPath: ProjectPathListItem,
  onSelectProject: (projectPath: string | null) => void,
  onDeleteProject: (projectPath: string | null) => void,
  onOpenProjectFolder: (projectPath: string | null) => void
}> = ({
  projectPath,
  onSelectProject,
  onDeleteProject,
  onOpenProjectFolder
}) => {
    return (
      <div className="flex justify-between items-center w-64 h-[40px]">
        <button
          onClick={() => onSelectProject(projectPath)}
          className={`flex items-center overflow-hidden whitespace-nowrap text-ellipsis w-48 h-[40px] pl-2 py-2 text-sm`}
        >
          {getFolderNameFromPath(projectPath)}
        </button>
        <div>
          <ThreeDotsButton
            projectPath={projectPath}
            onDeleteProject={onDeleteProject}
            onOpenProjectFolder={onOpenProjectFolder}
          />
        </div>
      </div>
    );
  };

export default ProjectItem;
