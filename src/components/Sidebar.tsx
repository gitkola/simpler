import React, { useState } from "react";
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
  selectProjectFolder,
} from "../utils/projectUtils";
import { setActiveProject, deleteProject } from "../store/projectsSlice";


const Sidebar: React.FC = () => {
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(true);
  const navItems = [
    { name: "Settings", icon: Settings, path: "/" },
  ];

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list, activeProjectId } = useSelector(
    (state: RootState) => state.projects,
  );

  const handleNewProject = async () => {
    try {
      const project = await selectProjectFolder();
      if (project) {
        dispatch(setActiveProject(project.id));
        navigate(`/project/${project.id}`);
      }
    } catch (error) {
      console.error("Failed to create/open project:", error);
    }
  };

  const handleDeleteProject = async (projectId: number) => {
    dispatch(deleteProject(projectId));
  };

  const handleSelectProject = (projectId: number) => {
    dispatch(setActiveProject(projectId));
    navigate(`/project/${projectId}`);
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
                  onClick={handleNewProject}
                  className="flex items-center w-full h-[40px] px-4 py-2 rounded-md text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  <Plus className="mr-2" size={16} />
                  Open Project
                </button>
                <ul>
                  {list.map((project) => (
                    <li key={project.id}>
                      <ProjectItem
                        project={project}
                        isActive={project.id === activeProjectId}
                        onSelectProject={() => handleSelectProject(project.id)}
                        onDeleteProject={handleDeleteProject}
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
