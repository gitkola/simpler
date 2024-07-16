import React, { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { NavLink, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Settings,
  ChevronLeft,
  ChevronDoubleRight,
} from "./Icons";
import ProjectItem from "./ProjectItem";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import {
  selectProjectStateFolder,
} from "../utils/projectStateUtils";
import { setActiveProject, deleteProject } from "../store/projectsSlice";
import { getFolderNameFromPath } from "../utils/getFolderNameFromPath";

const Sidebar: React.FC = () => {
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const navItems = [
    { name: "Settings", icon: Settings, path: "/" },
  ];

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
    <div className={`bg-gray-800 text-white h-full flex flex-col transition-all duration-300 ${isMinimized ? 'w-16' : 'w-64'}`}>
      <div className="p-4 flex justify-between items-center">
        {!isMinimized && <h1 className="text-2xl font-bold">Simpler</h1>}
        <button onClick={toggleMinimize} className="text-gray-300 hover:text-white">
          {isMinimized ? <ChevronDoubleRight size={24} /> : <ChevronLeft size={24} />}
        </button>
      </div>
      <nav className="flex-grow">
        <ul>
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 text-sm ${isActive
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`
                }
              >
                <item.icon className={isMinimized ? "" : "mr-3"} size={24} />
                {!isMinimized && item.name}
              </NavLink>
            </li>
          ))}
          <li>
            <button
              onClick={() => !isMinimized && setIsProjectsExpanded(!isProjectsExpanded)}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              {isMinimized ? (
                <ChevronRight size={24} />
              ) : isProjectsExpanded ? (
                <ChevronDown className="mr-3" size={24} />
              ) : (
                <ChevronRight className="mr-3" size={24} />
              )}
              {!isMinimized && "Projects"}
            </button>
            {!isMinimized && isProjectsExpanded && (
              <div className="mx-2">
                <button
                  onClick={handleOpenProject}
                  className="flex items-center w-full h-[40px] px-4 py-2 rounded-md text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  <Plus className="mr-2" size={16} />
                  Open Project
                </button>
                <ul>
                  {list.map((projectPath) => (
                    <li key={projectPath}>
                      <ProjectItem
                        projectPath={getFolderNameFromPath(projectPath)}
                        isActive={projectPath === activeProjectPath}
                        onSelectProject={() => handleSelectProject(projectPath)}
                        onDeleteProject={handleDeleteProject}
                        onOpenProjectFolder={() => handleOpenProjectFolder(projectPath)}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;