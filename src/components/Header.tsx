import { useAppSelector, useAppDispatch } from "../store";
import { invoke } from "@tauri-apps/api/tauri";
import { NavLink, useLocation } from "react-router-dom";
import { Projects, Settings, SidebarIcon } from "./Icons";
import { ThreeDotsButton } from "./ThreeDotsButton";
import { RootState } from "../store";
import { deleteProject } from "../store/projectsSlice";

export interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, onMenuClick }) => {
  const { activeProjectPath } = useAppSelector((state: RootState) => state.projects);
  const dispatch = useAppDispatch();
  const location = useLocation();

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
    <div className="flex items-center justify-between">
      <button
        className="text-white p-2 m-2 rounded-md focus:outline-none hover:bg-gray-400"
        onClick={onMenuClick}
      >
        <SidebarIcon size={24} />
      </button>
      <div className="flex items-center space-x-2">
        <h1 className="text-lg font-semibold">{location.pathname === "/project" ? activeProjectPath : title}</h1>
        {
          location.pathname === "/project" && <ThreeDotsButton
            projectPath={activeProjectPath}
            onDeleteProject={handleDeleteProject}
            onOpenProjectFolder={handleOpenProjectFolder}
            className="text-gray-100 p-2 m-2 rounded-md focus:outline-none hover:bg-gray-400"
          />
        }
      </div>
      {
        location.pathname === "/project" ? (
          <NavLink
            to={"/"}
            className={({ isActive }) =>
              `flex items-center p-2 m-2 rounded-md text-sm ${isActive
                ? "bg-gray-700 text-white hover:bg-gray-400"
                : "text-gray-300 hover:bg-gray-400 hover:text-white"
              }`
            }
          >
            <div className="flex items-center">
              <Settings size={24} />
            </div>
          </NavLink>
        ) : (
          <NavLink
            to={"/project"}
            className={({ isActive }) =>
              `flex items-center p-2 m-2 rounded-md text-sm ${isActive
                ? "bg-gray-700 text-white hover:bg-gray-400"
                : "text-gray-300 hover:bg-gray-400 hover:text-white"
              }`
            }
          >
            <div className="flex items-center">
              <Projects size={24} />
            </div>
          </NavLink>
        )
      }
    </div>
  );
};