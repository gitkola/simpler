import React from "react";
import SquareButton from "./SquareButton";
import { useOpenProject } from "../hooks/useOpenProject";
import { useAppDispatch, useAppSelector } from "../store";
import Spinner from "./Spinner";
import { setTheme } from "../store/settingsSlice";
import { useVisibility } from "react-visibility-persist";

const SidePanel: React.FC = () => {
  const handleOpenProject = useOpenProject();
  const dispatch = useAppDispatch();
  const { theme } = useAppSelector((state) => state.settings);
  const {
    isLoadingCurrentProjectState,
    isLoadingCurrentProjectMessages,
    isLoadingCurrentProjectSettings,
    isLoadingCurrentProjectOpenedFiles,
    isLoadingCurrentProjectFileTree,
  } = useAppSelector((state) => state.currentProject);

  const { visibilityState: vs, toggleVisibility: toggle } = useVisibility();

  return (
    <div className={`flex flex-col h-screen border-r border-opacity-30`}>
      <SquareButton
        onClick={async () => await handleOpenProject()}
        icon="open-folder"
        isActive={false}
      />
      <SquareButton
        onClick={() => toggle("projects")}
        icon="projects"
        isActive={vs["projects"]}
      />
      <SquareButton
        onClick={() => toggle("project-info")}
        icon="project-info"
        isActive={vs["project-info"]}
      />
      <SquareButton
        onClick={() => toggle("project-state")}
        icon="project-state"
        isActive={vs["project-state"]}
      />
      <SquareButton
        onClick={() => toggle("messages")}
        icon="scroll-text"
        isActive={vs["messages"]}
      />
      <SquareButton
        onClick={() => toggle("file-tree")}
        icon="file-tree"
        isActive={vs["file-tree"]}
      />
      <SquareButton
        onClick={() => toggle("project-files")}
        icon="files"
        isActive={vs["project-files"]}
      />
      <SquareButton
        onClick={() => toggle("code-editor")}
        icon="edit"
        isActive={vs["code-editor"]}
      />
      <SquareButton
        onClick={() => toggle("chat-view")}
        icon="sparkles"
        isActive={vs["chat-view"]}
      />
      <SquareButton
        onClick={() => toggle("ai-chat")}
        icon="ai-chat"
        isActive={vs["ai-chat"]}
      />
      <SquareButton
        onClick={() => toggle("thread")}
        icon="messages"
        isActive={vs["thread"]}
      />
      <SquareButton
        onClick={() => toggle("settings")}
        icon="settings"
        isActive={vs["settings"]}
      />
      <div className="flex-grow" />
      {(isLoadingCurrentProjectState ||
        isLoadingCurrentProjectMessages ||
        isLoadingCurrentProjectSettings ||
        isLoadingCurrentProjectOpenedFiles ||
        isLoadingCurrentProjectFileTree) && (
        <div className="w-12 h-12 flex items-center justify-center">
          <Spinner size="sm" color="blue" />
        </div>
      )}
      <SquareButton
        onClick={() => dispatch(setTheme(theme === "dark" ? "light" : "dark"))}
        icon={theme === "dark" ? "sun" : "moon"}
        isActive={false}
      />
    </div>
  );
};

export default SidePanel;
