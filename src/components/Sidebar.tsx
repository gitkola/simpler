import React, { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { NavLink, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Settings,
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

  return (
    <div className="w-64 bg-gray-800 text-white h-full flex flex-col">
      <div className="p-4">
        <h1 className="text-2xl font-bold">Simpler</h1>
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
                <item.icon className="mr-3" size={24} />
                {item.name}
              </NavLink>
            </li>
          ))}
          <li>
            <button
              onClick={() => setIsProjectsExpanded(!isProjectsExpanded)}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              {isProjectsExpanded ? (
                <ChevronDown className="mr-3" size={24} />
              ) : (
                <ChevronRight className="mr-3" size={24} />
              )}
              Projects
            </button>
            {isProjectsExpanded && (
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
