import { useAppSelector, useAppDispatch } from "../store";
import { invoke } from "@tauri-apps/api/tauri";
import { SidebarIcon } from "./Icons";
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
    <div className="flex items-center justify-between h-[40px] bg-gray-800">
      <button
        className="text-gray-100 p-2 focus:outline-none hover:bg-gray-400"
        onClick={onMenuClick}
      >
        <SidebarIcon size={24} />
      </button>
      <h1 className="ml-2 text-lg text-gray-100 font-semibold">{title}</h1>
      <ThreeDotsButton
        projectPath={activeProjectPath}
        onDeleteProject={handleDeleteProject}
        onOpenProjectFolder={handleOpenProjectFolder}
        className="text-gray-100 p-2 focus:outline-none hover:bg-gray-400"
      />
    </div>
  );
};