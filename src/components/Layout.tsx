import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Header } from "./Header";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { getFolderNameFromPath } from "../utils/getFolderNameFromPath";

const Layout: React.FC = () => {
  const [isMinimized, setIsMinimized] = useState(true);
  const location = useLocation();
  const path = location.state?.title || location.pathname;
  const { list, activeProjectPath } = useSelector(
    (state: RootState) => state.projects,
  );
  const title = path === "/" ? "Settings" : `${getFolderNameFromPath(activeProjectPath)}`;
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header title={title} onMenuClick={() => setIsMinimized(!isMinimized)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isMinimized={isMinimized} list={list} activeProjectPath={activeProjectPath} />
        <main className="flex-1 overflow-hidden no-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
