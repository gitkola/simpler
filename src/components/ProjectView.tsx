import { useEffect } from "react";
import { ChatView } from "./ChatView";
import ProjectStateView from "./ProjectStateView";
import ResizablePanel from "./ResizablePanel";
import { RootState, useAppDispatch, useAppSelector } from "../store";
import { loadProject } from "../store/currentProjectSlice";
import { useOpenProject } from "../hooks/useOpenProject";


export const ProjectView = () => {
  const dispatch = useAppDispatch();
  const handleOpenProject = useOpenProject();

  const activeProjectPath = useAppSelector((state: RootState) => state?.projects?.activeProjectPath);
  const projectState = useAppSelector((state: RootState) => state?.currentProject?.currentProjectState);

  useEffect(() => {
    load();
  }, [activeProjectPath]);

  const load = async () => {
    await dispatch(loadProject());
  };

  if (!activeProjectPath)
    return (
      <div className="flex h-full justify-center">
        <button
          onClick={handleOpenProject}
          className="bg-blue-500 text-white px-4 py-2 m-auto rounded-md hover:shadow-md"
        >
          Open Project
        </button>
      </div>
    );

  if (!projectState)
    return (
      <div className="flex h-full justify-center">
        <button
          onClick={load}
          className="bg-blue-500 text-white px-4 py-2 m-auto rounded-md hover:shadow-md"
        >
          Load Project
        </button>
      </div>
    );
  return (
    <ResizablePanel
      minLeftWidth={200}
      maxLeftWidth={800}
      left={<ProjectStateView />}
      right={<ChatView />}
    />
  );
};