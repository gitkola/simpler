import React, { useEffect } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import SidePanel from "./components/SidePanel";
import SourceViewer from "./components/SourceViewer";
import ProjectStateView from "./components/ProjectStateView";
import { ChatView } from "./components/ChatView";
import { RootState, useAppDispatch, useAppSelector } from "./store";
import { loadProject } from "./store/currentProjectSlice";
import ProjectList from "./components/ProjectList";
import FolderTreeView from "./components/FolderTreeView";
import Settings from "./components/Settings";
import { resizeHandle } from "./styles/styles";

const App: React.FC = () => {
  const activeProjectPath = useAppSelector((state: RootState) => state.projects.activeProjectPath);
  const dispatch = useAppDispatch();

  const loadProjectData = async () => {
    await dispatch(loadProject());
  };

  useEffect(() => {
    if (!activeProjectPath) return;
    loadProjectData();
  }, [activeProjectPath]);
  const { showProjects, showFolderTree, showSettings, showCodeEditor, showChat, showProjectState } = useAppSelector((state) => state.layout);

  return (
    <div className="flex h-screen w-screen">
      <SidePanel />
      <PanelGroup
        // autoSaveId="conditional"
        // autoSaveId="persistence"
        direction="horizontal"
        className="h-screen w-screen overflow-auto"
      >
        {
          showProjects && (
            <>
              <Panel minSize={8} maxSize={100} id="projects" order={1}>
                <ProjectList />
              </Panel>
              <PanelResizeHandle className={`${resizeHandle}`} />
            </>
          )
        }
        {
          showFolderTree && (
            <>
              <Panel minSize={8} maxSize={100} id="folder-tree" order={2}>
                <FolderTreeView />
              </Panel>
              <PanelResizeHandle className={`${resizeHandle}`} />
            </>
          )
        }
        {
          showCodeEditor && (
            <>
              <Panel minSize={24} maxSize={100} id="code-editor" order={3}>
                <SourceViewer />
              </Panel>
              <PanelResizeHandle className={`${resizeHandle}`} />
            </>
          )
        }
        {
          showProjectState && (
            <>
              <Panel minSize={16} maxSize={100} id="project-state" order={4}>
                <ProjectStateView />
              </Panel>
              <PanelResizeHandle className={`${resizeHandle}`} />
            </>
          )
        }
        {
          showChat && (
            <>
              <Panel minSize={24} maxSize={100} id="chat" order={5}>
                <ChatView />
              </Panel>
              <PanelResizeHandle className={`${resizeHandle}`} />
            </>
          )
        }
        {
          showSettings && (
            <Panel minSize={16} maxSize={100} id="settings" order={6}>
              <Settings />
            </Panel>
          )
        }
      </PanelGroup>
    </div>
  );
};

export default App;


/*
import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Settings from "./components/Settings";
import { ProjectView } from "./components/ProjectView";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Settings />} />
          <Route path="/project" element={<ProjectView />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
*/
