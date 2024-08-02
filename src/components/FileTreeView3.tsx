import { useAppSelector } from "../store";
import { Files } from "./Icons";
import ProcessIndicator from "./ProcessIndicator";
import FlatFileTreeExample from "./FileTree/FlatFileTreeExample";


export default function FileTreeView3() {
  const { isLoadingCurrentProjectFileTree, currentProjectFileTreeError } = useAppSelector((state) => state.currentProject);

  return (
    <div className="flex flex-col h-screen border-r border-0.5 min-w-[300px] overflow-x-scroll">
      <div className="flex p-2 space-x-2 items-center justify-start border-b border-0.5">
        <Files className="w-8 h-8" />
        <h2 className="text-lg font-semibold">Files</h2>
      </div>
      {isLoadingCurrentProjectFileTree && <ProcessIndicator />}
      {currentProjectFileTreeError && <div>{currentProjectFileTreeError}</div>}
      <nav aria-label="Files">
        <FlatFileTreeExample />
      </nav>
    </div>
  );
}