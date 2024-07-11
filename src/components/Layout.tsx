import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Sidebar from "./Sidebar";
import {
  selectProjectFolder,
} from "../utils/projectUtils";
import { RootState } from "../store";
import { setActiveProject, deleteProject } from "../store/projectsSlice";

const Layout: React.FC = () => {
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
    <div className="flex h-screen">
      <Sidebar
        projects={list || []}
        activeProjectId={activeProjectId}
        onNewProject={handleNewProject}
        onSelectProject={handleSelectProject}
        onDeleteProject={handleDeleteProject}
      />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
