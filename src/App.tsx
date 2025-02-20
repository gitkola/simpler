import React, { useEffect, useMemo, useCallback } from "react";
import SidePanel from "./components/SidePanel";
import EditorView from "./components/EditorView";
import ProjectInfoView from "./components/ProjectInfoView";
// import { ChatView } from "./components/ChatUI/ChatView";
import { RootState, useAppDispatch, useAppSelector } from "./store";
import { loadProject } from "./store/currentProjectSlice";
import ProjectListView from "./components/ProjectListView";
import FileTreeView from "./components/FileTreeView";
import SettingsView from "./components/SettingsView";
import { StyleTag } from "./styles/styles";
import ProjectStateView from "./components/ProjectStateView";
import ProjectMessagesView from "./components/ProjectMessagesView";
import ProjectFilesView from "./components/ProjectFilesView";
import { ChatViewAISDK } from "./components/ChatViewAISDK";
import ErrorBoundary from "./components/ErrorBoundary";
import { ChatDemo } from "./components/ChatDemo";

const App: React.FC = () => {
  const activeProjectPath = useAppSelector(
    (state: RootState) => state.projects.activeProjectPath
  );
  const layoutState = useAppSelector((state: RootState) => state.layout);
  const dispatch = useAppDispatch();

  const loadProjectData = useCallback(async () => {
    await dispatch(loadProject());
  }, []);

  useEffect(() => {
    if (activeProjectPath) {
      loadProjectData();
    }
  }, [activeProjectPath]);

  const viewComponents = useMemo(
    () => [
      { condition: layoutState.showProjects, component: <ProjectListView /> },
      {
        condition: layoutState.showProjectInfo,
        component: <ProjectInfoView />,
      },
      {
        condition: layoutState.showProjectState,
        component: <ProjectStateView />,
      },
      {
        condition: layoutState.showProjectMessages,
        component: <ProjectMessagesView />,
      },
      {
        condition: layoutState.showProjectFiles,
        component: <ProjectFilesView />,
      },
      { condition: layoutState.showFileTree, component: <FileTreeView /> },
      { condition: layoutState.showCodeEditor, component: <EditorView /> },
      // { condition: layoutState.showChat, component: <ChatView /> },
      { condition: layoutState.showChat, component: <ChatDemo /> },
      { condition: layoutState.showThread, component: <ChatViewAISDK /> },
      { condition: layoutState.showSettings, component: <SettingsView /> },
    ],
    [layoutState]
  );

  return (
    <ErrorBoundary>
      <div className="flex h-screen" role="application">
        <StyleTag />
        <SidePanel />
        <div className="flex flex-column flex-1 overflow-x-scroll overflow-y-hidden">
          <div className="flex flex-1">
            {viewComponents.map(
              (view, index) =>
                view.condition && (
                  <div className="flex flex-column flex-1 h-full" key={index}>
                    {view.component}
                  </div>
                )
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default React.memo(App);
