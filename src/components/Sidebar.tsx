import React from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { NavLink, useNavigate } from "react-router-dom";
import {
  OpenFolder,
  Settings,
} from "./Icons";
import ProjectItem from "./ProjectItem";
import { useAppDispatch } from "../store";
import { handleSetActiveProject, deleteProject } from "../store/projectsSlice";
import { ProjectPathListItem } from "../types";
import { useOpenProject } from "../hooks/useOpenProject";

export interface SidebarProps {
  isMinimized: boolean;
  list: ProjectPathListItem[];
  activeProjectPath: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({ isMinimized, list, activeProjectPath }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleOpenProject = useOpenProject();

  const handleSelectProject = (projectPath: string | null) => {
    if (!projectPath) return;
    dispatch(handleSetActiveProject(projectPath));
    navigate(`/project`);
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
    <aside className={`bg-gray-800 flex flex-col pb-2 space-y-2 overflow-x-hidden transition-all duration-100 ${isMinimized ? 'w-0' : 'w-64'}`}>
      <button
        onClick={async () => { await handleOpenProject(); }}
        className="flex items-center ml-2 p-2 rounded-md text-sm text-gray-300 hover:bg-gray-400 hover:text-white"
      >
        <div className="flex items-center">
          <OpenFolder className="flex mr-2" size={24} />
          Open Project
        </div>
      </button>
      <ul className="flex-1 space-y-2 overflow-y-auto overflow-x-hidden no-scrollbar pb-8">
        {list.map((projectPath) => (
          <li key={projectPath}>
            <NavLink
              to={"/project"}
              className={({ isActive }) =>
                `flex items-center ml-2 rounded-md text-sm ${(isActive && projectPath === activeProjectPath)
                  ? "bg-gray-700 text-white hover:bg-gray-400"
                  : "text-gray-300 hover:bg-gray-400 hover:text-white"
                }`
              }
            >
              <ProjectItem
                projectPath={projectPath}
                onSelectProject={() => handleSelectProject(projectPath)}
                onDeleteProject={handleDeleteProject}
                onOpenProjectFolder={() => handleOpenProjectFolder(projectPath)}
              />
            </NavLink>
          </li>
        ))}
      </ul>
      <NavLink
        to={"/"}
        className={({ isActive }) =>
          `flex ml-2 rounded-md items-center px-2 py-2 text-sm ${isActive
            ? "bg-gray-700 text-white hover:bg-gray-400"
            : "text-gray-300 hover:bg-gray-400 hover:text-white"
          }`
        }
      >
        <div className="flex items-center">
          <Settings className="flex mr-2" size={24} />
          Settings
        </div>
      </NavLink>
    </aside>
  );
};

export default Sidebar;