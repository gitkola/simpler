import React from "react";
import { invoke } from "@tauri-apps/api/tauri";
import ProjectItem from "./ProjectItem";
import { RootState, useAppDispatch, useAppSelector } from "../store";
import { handleSetActiveProject, deleteProject } from "../store/projectsSlice";
import { Projects } from "./Icons";

const ProjectList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { list, activeProjectPath } = useAppSelector(
    (state: RootState) => state.projects,
  );

  const handleSelectProject = (projectPath: string | null) => {
    if (!projectPath) return;
    dispatch(handleSetActiveProject(projectPath));
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
      <div className="flex p-2 space-x-2 items-center justify-start border-b-2">
        <Projects className="w-8 h-8" />
        <h2 className="text-lg font-semibold">Projects</h2>
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