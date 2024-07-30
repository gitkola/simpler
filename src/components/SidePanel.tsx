import React from "react";
import SquareButton from "./SquareButton";
import { useOpenProject } from "../hooks/useOpenProject";
import { useAppDispatch, useAppSelector } from "../store";
import { setShowChat, setShowCodeEditor, setShowFolderTree, setShowProjects, setShowProjectState, setShowSettings } from "../store/layoutSlice";

const SidePanel: React.FC = () => {
  const handleOpenProject = useOpenProject();
  const dispatch = useAppDispatch();
  const { showProjects, showFolderTree, showSettings, showCodeEditor, showChat, showProjectState } = useAppSelector((state) => state.layout);

  const toggleView = (value: string) => {
    switch (value) {
      case "projects":
        return dispatch(setShowProjects(!showProjects));
      case "folder-tree":
        return dispatch(setShowFolderTree(!showFolderTree));
      case "settings":
        return dispatch(setShowSettings(!showSettings));
      case "code-editor":
        return dispatch(setShowCodeEditor(!showCodeEditor));
      case "chat":
        return dispatch(setShowChat(!showChat));
      case "project-state":
        return dispatch(setShowProjectState(!showProjectState));
      default:
        return false;
    }
  };

  return (
    <div className={`h-screen flex flex-col overflow-x-hidden space-y-0.5 px-0.5 border-r-2`}>
      <SquareButton
        onClick={async () => await handleOpenProject()}
        icon="open-folder"
        isActive={false}
      />
      <SquareButton
        onClick={() => toggleView("projects")}
        icon="projects"
        isActive={showProjects}
      />
      <SquareButton
        onClick={() => toggleView("folder-tree")}
        icon="folder-tree"
        isActive={showFolderTree}
      />
      <SquareButton
        onClick={() => toggleView("code-editor")}
        icon="code-editor"
        isActive={showCodeEditor}
      />
      <SquareButton
        onClick={() => toggleView("project-state")}
        icon="project-state"
        isActive={showProjectState}
      />
      <SquareButton
        onClick={() => toggleView("chat")}
        icon="chat"
        isActive={showChat}
      />
      <SquareButton
        onClick={() => toggleView("settings")}
        icon="settings"
        isActive={showSettings}
      />
    </div>
  );
};

export default SidePanel;