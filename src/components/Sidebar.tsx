import React, { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Plus,
  Settings,
  SidebarIcon,
} from "./Icons";
import ProjectItem from "./ProjectItem";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import {
  selectProjectStateFolder,
} from "../utils/projectStateUtils";
import { setActiveProject, deleteProject } from "../store/projectsSlice";

const Sidebar: React.FC = () => {
  const [isMinimized, setIsMinimized] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list, activeProjectPath } = useSelector(
    (state: RootState) => state.projects,
  );

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

  const handleSelectProject = (projectPath: string) => {
    dispatch(setActiveProject(projectPath));
    navigate(`/project`);
  };

  const handleDeleteProject = async (projectPath: string) => {
    dispatch(deleteProject(projectPath));
  };

  const handleOpenProjectFolder = async (projectPath: string) => {
    try {
      await invoke("open_folder", { path: projectPath });
    } catch (error) {
      console.error("Failed to open project folder:", error);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className={`bg-gray-800 overflow-hidden text-white flex flex-col transition-all duration-300 ${isMinimized ? 'w-14' : 'w-64'}`}>
      <button
        onClick={toggleMinimize}
        className="flex justify-start w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-400 hover:text-white"
      >
        <SidebarIcon size={24} />
      </button>
      <button
        onClick={handleOpenProject}
        className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-400 hover:text-white"
      >
        <div className="flex items-center">
          <Plus className="flex mr-4" size={24} />
          Open
        </div>
      </button>
      <ul className="flex flex-col overflow-y-scroll overflow-x-hidden no-scrollbar pb-16">
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
          `flex items-center px-4 py-2 text-sm ${isActive
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
    </div>
  );
};

export default Sidebar;