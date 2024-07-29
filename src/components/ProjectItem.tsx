import React from 'react';
import { ProjectPathListItem } from "../types";
import { getFolderNameFromPath } from '../utils/pathUtils';
import SquareButton from './SquareButton';

const ProjectItem: React.FC<{
  isActive?: boolean,
  projectPath: ProjectPathListItem,
  onSelectProject: (projectPath: string | null) => void,
  onDeleteProject: (projectPath: string | null) => void,
  onOpenProjectFolder: (projectPath: string | null) => void
}> = ({
  isActive,
  projectPath,
  onSelectProject,
  onDeleteProject,
  onOpenProjectFolder
}) => {

    return (
      <div className={`flex justify-between items-center py-1 px-1 space-x-1 text-white hover:bg-blue-600 ${isActive && "bg-blue-800"}`}>
        <button
          onClick={() => onSelectProject(projectPath)}
          className={`flex-1 text-left overflow-hidden whitespace-nowrap text-sm text-ellipsis px-2 py-1`}
        >
          {getFolderNameFromPath(projectPath)}
        </button>
        <SquareButton
          icon='trash'
          iconSize={16}
          onClick={() => onDeleteProject(projectPath)}
          className="hover:text-red-500 hover:bg-transparent w-6 h-6 bg-transparent"
        />
        <SquareButton
          icon='open-folder'
          iconSize={16}
          onClick={() => onOpenProjectFolder(projectPath)}
          className="hover:text-white hover:bg-transparent w-6 h-6 bg-transparent"
        />
      </div>
    );
  };

export default ProjectItem;
