import React from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Plus,
  Settings,
} from "./Icons";
import ProjectItem from "./ProjectItem";
import { useDispatch } from "react-redux";
import {
  selectProjectStateFolder,
} from "../utils/projectStateUtils";
import { setActiveProject, deleteProject } from "../store/projectsSlice";
import { ProjectPathListItem } from "../types";

export interface SidebarProps {
  isMinimized: boolean;
  list: ProjectPathListItem[];
  activeProjectPath: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({ isMinimized, list, activeProjectPath }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOpenProject = async () => {
    try {
      const projectPath = await selectProjectStateFolder();
      if (projectPath) {
        dispatch(setActiveProject(projectPath));
        navigate(`/project`);
      }
    } catch (error) {
      console.error("Failed to create/open project:", error);
    }
  };

  const handleSelectProject = (projectPath: string | null) => {
    if (!projectPath) return;
    dispatch(setActiveProject(projectPath));
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
    <aside className={`bg-gray-800 flex flex-col overflow-x-hidden transition-all duration-100 ${isMinimized ? 'w-0' : 'w-64'}`}>
      <button
        onClick={handleOpenProject}
        className="flex items-center w-full px-2 py-2 text-sm text-gray-300 hover:bg-gray-400 hover:text-white"
      >
        <div className="flex items-center">
          <Plus className="flex mr-4" size={24} />
          Open
        </div>
      </button>
      <ul className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar pb-8">
        {list.map((projectPath) => (
          <li key={projectPath}>
            <NavLink
              to={"/project"}
              className={({ isActive }) =>
                `flex items-center text-sm ${(isActive && projectPath === activeProjectPath)
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
          `flex items-center px-2 py-2 text-sm ${isActive
            ? "bg-gray-700 text-white hover:bg-gray-400"
            : "text-gray-300 hover:bg-gray-400 hover:text-white"
          }`
        }
      >
        <div className="flex items-center">
          <Settings className="flex mr-4" size={24} />
          Settings
        </div>
      </NavLink>
    </aside>
  );
};

export default Sidebar;