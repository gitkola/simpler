import React from "react";
import SquareButton from "./SquareButton";
import { useOpenProject } from "../hooks/useOpenProject";
import { useAppDispatch, useAppSelector } from "../store";
import { setShowChat, setShowCodeEditor, setShowFolderTree, setShowProjects, setShowProjectState, setShowSettings } from "../store/layoutSlice";
import Spinner from './Spinner';

const SidePanel: React.FC = () => {
  const handleOpenProject = useOpenProject();
  const dispatch = useAppDispatch();
  const { showProjects, showFileTree, showSettings, showCodeEditor, showChat, showProjectState } = useAppSelector((state) => state.layout);
  const { isLoadingCurrentProjectState, isLoadingCurrentProjectMessages, isLoadingCurrentProjectSettings, isLoadingCurrentProjectOpenedFiles, isLoadingCurrentProjectFileTree } = useAppSelector((state) => state.currentProject);

  const toggleView = (value: string) => {
    switch (value) {
      case "projects":
        return dispatch(setShowProjects(!showProjects));
      case "files":
        return dispatch(setShowFolderTree(!showFileTree));
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
    <div className={`flex flex-col h-screen space-y-0.5 border-r border-0.5`}>
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
        onClick={() => toggleView("project-state")}
        icon="project-state"
        isActive={showProjectState}
      />
      <SquareButton
        onClick={() => toggleView("files")}
        icon="files"
        isActive={showFileTree}
      />
      <SquareButton
        onClick={() => toggleView("code-editor")}
        icon="code-editor"
        isActive={showCodeEditor}
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
      <div className="flex-grow" />
      {(isLoadingCurrentProjectState || isLoadingCurrentProjectMessages || isLoadingCurrentProjectSettings || isLoadingCurrentProjectOpenedFiles || isLoadingCurrentProjectFileTree) &&
        <div className="w-12 h-12 flex items-center justify-center">
          <Spinner size="sm" color="blue" />
        </div>
      }
    </div>
  );
};

export default SidePanel;