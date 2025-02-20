import React from "react";
import { invoke } from "@tauri-apps/api/tauri";
import ProjectItem from "./ProjectItem";
import { RootState, useAppDispatch, useAppSelector } from "../store";
import { handleSetActiveProject, deleteProject } from "../store/projectsSlice";
import { Projects } from "./Icons";
import SquareButton from "./SquareButton";
import { setShowProjects } from "../store/layoutSlice";

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
    <div className={`flex flex-1 flex-col border-r border-0.5 h-full min-w-[400px] max-w-[1200px]`}>
      <div className="flex pl-2 items-center justify-between border-b border-0.5">
        <div className="flex space-x-2 items-center justify-start">
          <Projects className="w-8 h-8" />
          <h2 className="text-lg font-semibold">Projects</h2>
        </div>
        <SquareButton icon="close" className="" onClick={() => { dispatch(setShowProjects(false)); }} />
      </div>
      <ul className="overflow-y-scroll overflow-x-hidden">
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