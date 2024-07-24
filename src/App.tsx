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
