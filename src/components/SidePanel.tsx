import React from "react";
import SquareButton from "./SquareButton";
import { useOpenProject } from "../hooks/useOpenProject";
import { useAppDispatch, useAppSelector } from "../store";
import { setActiveSideMenuItem } from "../store/layoutSlice";

export interface SidePanelProps {
  togglePanel: () => void;
}

const SidePanel: React.FC<SidePanelProps> = ({
  togglePanel,
}: SidePanelProps) => {
  const handleOpenProject = useOpenProject();
  const dispatch = useAppDispatch();
  const activeSideMenuItem = useAppSelector((state) => state.layout.activeSideMenuItem);

  const onSideMenuItemClick = (value: string) => {
    dispatch(setActiveSideMenuItem(value));
  };

  return (
    <div className={`h-screen flex flex-col bg-gray-800 pb-2 overflow-x-hidden border-r border-gray-700 border-0.5`}>
      <SquareButton
        onClick={togglePanel}
        icon="sidebar"
        isActive={activeSideMenuItem === "sidebar"}
      />
      <SquareButton
        onClick={async () => await handleOpenProject()}
        icon="open-folder"
        isActive={activeSideMenuItem === "sidebar"}
      />
      <SquareButton
        onClick={() => onSideMenuItemClick("projects")}
        icon="projects"
        isActive={activeSideMenuItem === "projects"}
      />
      <SquareButton
        onClick={() => onSideMenuItemClick("folder-tree")}
        icon="folder-tree"
        isActive={activeSideMenuItem === "folder-tree"}
      />
      <SquareButton
        onClick={() => onSideMenuItemClick("settings")}
        icon="settings"
        isActive={activeSideMenuItem === "settings"}
      />
    </div>
  );
};

export default SidePanel;