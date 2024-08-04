import React from "react";
import { ProjectPathListItem } from "../types";
import { getFolderNameFromPath } from "../utils/pathUtils";
import SquareButton from "./SquareButton";
import { cPrimary } from "../styles/styles";

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
        className={`group flex justify-between items-center ${cPrimary(isActive)}`}
      >
        <button
          onClick={() => onSelectProject(projectPath)}
          className={`flex-1 text-left overflow-hidden whitespace-nowrap text-ellipsis px-2 py-1`}
        >
          {getFolderNameFromPath(projectPath)}
        </button>
        <SquareButton
          icon="open-folder"
          iconSize={20}
          onClick={() => onOpenProjectFolder(projectPath)}
          className="w-8 h-8 opacity-0 group-hover:opacity-100 hover:bg-blue-400 hover:bg-opacity-70"
        />
        <SquareButton
          icon="close"
          iconSize={26}
          onClick={() => onDeleteProject(projectPath)}
          className="w-8 h-8 opacity-0 group-hover:opacity-100 hover:bg-blue-400 hover:bg-opacity-70"
          iconClassName="text-red-500"
        />
      </div>
    );
  };

export default ProjectItem;
