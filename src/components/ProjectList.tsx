import React from "react";
import { invoke } from "@tauri-apps/api/tauri";
// import { NavLink, useNavigate } from "react-router-dom";
import ProjectItem from "./ProjectItem";
import { RootState, useAppDispatch, useAppSelector } from "../store";
import { handleSetActiveProject, deleteProject } from "../store/projectsSlice";
import SquareButton from "./SquareButton";
import { useOpenProject } from "../hooks/useOpenProject";

export interface ProjectListProps {
}

const ProjectList: React.FC<ProjectListProps> = ({ }) => {
  const dispatch = useAppDispatch();
  // const navigate = useNavigate();
  const { list, activeProjectPath } = useAppSelector(
    (state: RootState) => state.projects,
  );
  const handleOpenProject = useOpenProject();

  const handleSelectProject = (projectPath: string | null) => {
    if (!projectPath) return;
    dispatch(handleSetActiveProject(projectPath));
    // navigate(`/project`);
  };

  const handleDeleteProject = async (projectPath: string | null) => {
    if (!projectPath) return;
    dispatch(deleteProject(projectPath));
  };

  const handleOpenProjectFolder = async (projectPath: string | null) => {
    if (!projectPath) return;
    try {
      await invoke("open_folder", { path: projectPath });
    } catch (error) {
      console.error("Failed to open project folder:", error);
    }
  };

  return (
    <div className={`flex-1 flex-col h-full`}>
      <div className="flex items-center text-gray-300">
        <SquareButton
          onClick={async () => await handleOpenProject()}
          icon="open-folder"
        />
      </div>
      <ul className="flex-1 h-screen overflow-y-auto overflow-x-hidden pb-16">
        {list.map((projectPath) => (
          <li key={projectPath}>
            <ProjectItem
              isActive={projectPath === activeProjectPath}
              projectPath={projectPath}
              onSelectProject={(projectPath) => handleSelectProject(projectPath)}
              onDeleteProject={handleDeleteProject}
              onOpenProjectFolder={() => handleOpenProjectFolder(projectPath)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectList;