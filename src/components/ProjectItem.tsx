import React from "react";
import { ProjectPathListItem } from "../types";
import { getFolderNameFromPath } from "../utils/pathUtils";
import SquareButton from "./SquareButton";

const ProjectItem: React.FC<{
  isActive?: boolean;
  projectPath: ProjectPathListItem;
  onSelectProject: (projectPath: string | null) => void;
  onDeleteProject: (projectPath: string | null) => void;
  onOpenProjectFolder: (projectPath: string | null) => void;
}> = ({
  isActive,
  projectPath,
  onSelectProject,
  onDeleteProject,
  onOpenProjectFolder,
}) => {
    return (
      <div
        className={`flex justify-between items-center pl-1 pr-2 space-x-4 hover:bg-blue-500 ${isActive && "bg-blue-600"
          }`}
      >
        <button
          onClick={() => onSelectProject(projectPath)}
          className={`flex-1 text-left overflow-hidden whitespace-nowrap text-ellipsis px-2 py-1`}
        >
          {getFolderNameFromPath(projectPath)}
        </button>
        <SquareButton
          icon="trash"
          iconSize={20}
          onClick={() => onDeleteProject(projectPath)}
          className="hover:bg-transparent w-6 h-6 bg-transparent hover:text-red-600"
        />
        <SquareButton
          icon="open-folder"
          iconSize={20}
          onClick={() => onOpenProjectFolder(projectPath)}
          className="hover:bg-transparent w-6 h-6 bg-transparent hover:text-white"
        />
      </div>
    );
  };

export default ProjectItem;
