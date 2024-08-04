import React from "react";
import { invoke } from "@tauri-apps/api/tauri";
import ProjectItem from "./ProjectItem";
import { RootState, useAppDispatch, useAppSelector } from "../store";
import { handleSetActiveProject, deleteProject } from "../store/projectsSlice";
import { Projects } from "./Icons";

const ProjectListView: React.FC = () => {
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
    <div className={`flex flex-col h-screen border-r border-0.5 min-w-[400px] overflow-x-scroll`}>
      <div className="flex p-2 space-x-2 items-center justify-start border-b border-0.5">
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

export default ProjectListView;