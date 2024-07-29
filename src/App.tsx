import React, { useEffect, useRef } from "react";
import { ImperativePanelHandle, Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import SidePanel from "./components/SidePanel";
import SourceBrowser from "./components/SourceBrowser";
import SourceViewer from "./components/SourceViewer";
import ProjectStateView from "./components/ProjectStateView";
import { ChatView } from "./components/ChatView";
import { RootState, useAppDispatch, useAppSelector } from "./store";
import { loadProject } from "./store/currentProjectSlice";

const App: React.FC = () => {
  const sourceBrowserRef = useRef<ImperativePanelHandle>(null);
  const activeProjectPath = useAppSelector((state: RootState) => state.projects.activeProjectPath);
  const dispatch = useAppDispatch();
  const togglePanel = () => {
    const panel = sourceBrowserRef.current;
    if (panel?.isCollapsed()) {
      panel.expand();
    } else {
      panel?.collapse();
    }
  };

  const loadProjectData = async () => {
    await dispatch(loadProject());
  };

  useEffect(() => {
    if (!activeProjectPath) return;
    loadProjectData();
  }, [activeProjectPath]);

  return (
    <PanelGroup autoSaveId="persistence" direction="horizontal" className="">
      <SidePanel togglePanel={() => togglePanel()} />
      <Panel collapsible minSize={8} ref={sourceBrowserRef} className="border-r border-gray-700 border-0.5">
        <SourceBrowser />
      </Panel>
      <PanelResizeHandle />
      <Panel collapsible minSize={24} maxSize={32} className="border-r border-gray-700 border-0.5">
        <SourceViewer />
      </Panel>
      <PanelResizeHandle />
      <Panel collapsible minSize={24} maxSize={32} className="border-r border-gray-700 border-0.5">
        <ProjectStateView />
      </Panel>
      <PanelResizeHandle />
      <Panel collapsible minSize={24} maxSize={32} className="">
        <ChatView />
      </Panel>
    </PanelGroup>
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
