import React from "react";
import SquareButton from "./SquareButton";

export interface SidePanelProps {
  onSideMenuItemClick: (value: string) => void;
  activeSideMenuItem: string | null;
  onSetIsMinimized: () => void;
}

const SidePanel: React.FC<SidePanelProps> = ({ onSideMenuItemClick, activeSideMenuItem, onSetIsMinimized }: SidePanelProps) => {
  return (
    <div className={`h-screen flex flex-col bg-gray-800 w-10 pb-2 overflow-x-hidden border-r border-gray-700 border-0.5`}>
      <SquareButton
        onClick={onSetIsMinimized}
        icon="sidebar"
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