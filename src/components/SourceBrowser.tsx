import { useAppSelector } from "../store";
import FolderTreeView from "./FolderTreeView";
import ProjectList from "./ProjectList";
import Settings from "./Settings";

export default function SourceBrowser() {
  const activeSideMenuItem = useAppSelector((state) => state.layout.activeSideMenuItem);
  switch (activeSideMenuItem) {
    case "projects":
      return (
        <ProjectList />
      );
    case "folder-tree":
      return (
        <FolderTreeView />
      );
    case "settings":
      return (
        <Settings />
      );
    default:
      return null;
  }
}