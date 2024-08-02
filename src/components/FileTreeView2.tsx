import { useAppSelector } from "../store";
import { Files } from "./Icons";
import ProcessIndicator from "./ProcessIndicator";
import FileTreeExample from "./FileTree/FileTreeExample";


export default function FileTreeView2() {
  const { isLoadingCurrentProjectFileTree, currentProjectFileTreeError } = useAppSelector((state) => state.currentProject);

  return (
    <div className="flex flex-col h-screen border-r-2 min-w-[300px] overflow-x-scroll">
      <div className="flex p-2 space-x-2 items-center justify-start border-b-2">
        <Files className="w-8 h-8" />
        <h2 className="text-lg font-semibold">Files</h2>
      </div>
      {isLoadingCurrentProjectFileTree && <ProcessIndicator />}
      {currentProjectFileTreeError && <div>{currentProjectFileTreeError}</div>}
      <nav aria-label="Files">
        <FileTreeExample />
      </nav>
    </div>
  );
}