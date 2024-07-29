import React, { useRef } from "react";
import { ImperativePanelHandle, Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import SidePanel from "./components/SidePanel";
import SourceBrowser from "./components/SourceBrowser";

const App: React.FC = () => {
  const [activeSideMenuItem, setActiveSideMenuItem] = React.useState<string>("projects");
  const ref = useRef<ImperativePanelHandle>(null);
  const togglePanel = () => {
    const panel = ref.current;
    if (panel?.isCollapsed()) {
      panel.expand();
    } else {
      panel?.collapse();
    }
  };
  return (
    <PanelGroup direction="horizontal" className="bg-gray-800">
      <SidePanel onSideMenuItemClick={(value) => setActiveSideMenuItem(value)} activeSideMenuItem={activeSideMenuItem} onSetIsMinimized={() => togglePanel()} />
      <Panel collapsible minSize={24} ref={ref}>
        <SourceBrowser activeSource={activeSideMenuItem} />
      </Panel>
      <PanelResizeHandle className="w-0.5 bg-gray-800 hover:bg-gray-400" />
      <Panel>
        {/* <SourceViewer /> */}
        <div className="h-full bg-blue-300">SourceViewer</div>
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
