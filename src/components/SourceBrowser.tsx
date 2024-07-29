import FolderTreeView from "./FolderTreeView";
import ProjectList from "./ProjectList";
import Settings from "./Settings";

interface SourceBrowserProps {
  activeSource: string | null;
}

export default function SourceBrowser({ activeSource }: SourceBrowserProps) {

  switch (activeSource) {
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