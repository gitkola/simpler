import React, { useEffect, useCallback } from "react";
import { createVisibilityBlock } from "react-visibility-persist";
import SidePanel from "./components/SidePanel";
import EditorView from "./components/EditorView";
import ProjectInfoView from "./components/ProjectInfoView";
import { RootState, useAppDispatch, useAppSelector } from "./store";
import { loadProject } from "./store/currentProjectSlice";
import ProjectListView from "./components/ProjectListView";
import FileTreeView from "./components/FileTreeView";
import SettingsView from "./components/SettingsView";
import { StyleTag } from "./styles/styles";
import ProjectStateView from "./components/ProjectStateView";
import ProjectMessagesView from "./components/ProjectMessagesView";
import ProjectFilesView from "./components/ProjectFilesView";
import ErrorBoundary from "./components/ErrorBoundary";
import { ChatViewAISDK } from "./components/ChatViewAISDK";
import { ChatView } from "./components/ChatUI/ChatView";
import { ChatDemo } from "./components/ChatDemo";

export const [ProjectListVisibilityBlock, ToggleProjectListVisibility] =
  createVisibilityBlock("projects");
export const [ProjectInfoVisibilityBlock, ToggleProjectInfoVisibility] =
  createVisibilityBlock("project-info");
export const [ProjectStateVisibilityBlock, ToggleProjectStateVisibility] =
  createVisibilityBlock("project-state");
export const [ProjectMessagesVisibilityBlock, ToggleProjectMessagesVisibility] =
  createVisibilityBlock("messages");
export const [ProjectFilesVisibilityBlock, ToggleProjectFilesVisibility] =
  createVisibilityBlock("project-files");
export const [FileTreeVisibilityBlock, ToggleFileTreeVisibility] =
  createVisibilityBlock("file-tree");
export const [EditorVisibilityBlock, ToggleEditorVisibility] =
  createVisibilityBlock("code-editor");
export const [ChatViewVisibilityBlock, ToggleChatViewVisibility] =
  createVisibilityBlock("chat-view");
export const [ChatDemoVisibilityBlock, ToggleChatDemoVisibility] =
  createVisibilityBlock("ai-chat");
export const [ChatViewAISDKVisibilityBlock, ToggleChatViewAISDKVisibility] =
  createVisibilityBlock("thread");
export const [SettingsVisibilityBlock, ToggleSettingsVisibility] =
  createVisibilityBlock("settings");

const App: React.FC = () => {
  const activeProjectPath = useAppSelector(
    (state: RootState) => state.projects.activeProjectPath
  );
  const dispatch = useAppDispatch();

  const loadProjectData = useCallback(async () => {
    await dispatch(loadProject());
  }, []);

  useEffect(() => {
    if (activeProjectPath) {
      loadProjectData();
    }
  }, [activeProjectPath]);

  return (
    <ErrorBoundary>
      <div className="flex h-screen" role="application">
        <StyleTag />
        <SidePanel />
        <div className="flex flex-column flex-1 overflow-x-scroll overflow-y-hidden">
          <div className="flex flex-1">
            <ProjectListVisibilityBlock className="flex flex-1">
              <ProjectListView />
            </ProjectListVisibilityBlock>
            <ProjectInfoVisibilityBlock className="flex flex-1">
              <ProjectInfoView />
            </ProjectInfoVisibilityBlock>
            <ProjectStateVisibilityBlock className="flex flex-1">
              <ProjectStateView />
            </ProjectStateVisibilityBlock>
            <ProjectMessagesVisibilityBlock className="flex flex-1">
              <ProjectMessagesView />
            </ProjectMessagesVisibilityBlock>
            <ProjectFilesVisibilityBlock className="flex flex-1">
              <ProjectFilesView />
            </ProjectFilesVisibilityBlock>
            <FileTreeVisibilityBlock className="flex flex-1">
              <FileTreeView />
            </FileTreeVisibilityBlock>
            <EditorVisibilityBlock className="flex flex-1">
              <EditorView />
            </EditorVisibilityBlock>
            <ChatViewVisibilityBlock className="flex flex-1">
              <ChatView />
            </ChatViewVisibilityBlock>
            <ChatDemoVisibilityBlock className="flex flex-1">
              <ChatDemo />
            </ChatDemoVisibilityBlock>
            <ChatViewAISDKVisibilityBlock className="flex flex-1">
              <ChatViewAISDK />
            </ChatViewAISDKVisibilityBlock>
            <SettingsVisibilityBlock className="flex flex-1">
              <SettingsView />
            </SettingsVisibilityBlock>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default React.memo(App);
