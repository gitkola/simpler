import { TreeView } from "@primer/react";
import { useAppDispatch, useAppSelector } from "../store";
import {
  getFolderNameFromFilePath,
} from "../utils/pathUtils";
import { File, FolderTree } from "./Icons";
import SquareButton from "./SquareButton";
import { openFolder } from "../services/fsService";
import { handleClickOnFile, handleClickOnFolder, ITreeData } from "../store/currentProjectSlice";
import ProcessIndicator from "./ProcessIndicator";

const treeItemIsFile = (tree: ITreeData) => Array.isArray(tree?.children) === false;

export default function FileTreeView() {
  const activeProjectPath = useAppSelector((state) => state.projects.activeProjectPath);
  const { currentProjectFileTree, isLoadingCurrentProjectFileTree, currentProjectFileTreeError } = useAppSelector((state) => state.currentProject);
  const dispatch = useAppDispatch();

  const handleClickTreeItem = async (tree: ITreeData) => {
    if (treeItemIsFile(tree)) {
      await dispatch(handleClickOnFile(`${activeProjectPath}${tree.path}`));
    } else {
      dispatch(handleClickOnFolder({ ...tree }));
    };
  }

  const renderTreeItem = (tree: ITreeData) => (
    <TreeView.Item
      key={tree.path}
      id={tree.path}
      onSelect={async () => await handleClickTreeItem(tree)}
      expanded={tree.isOpen}
    >
      <div className="group flex m-0 p-1 hover:bg-opacity-50 hover:bg-blue-300">
        <TreeView.LeadingVisual label={tree.name}>
          {tree.children === undefined ? (
            <File size={20} />
          ) : (
            <TreeView.DirectoryIcon />
          )}
        </TreeView.LeadingVisual>
        <div className="flex w-full ml-2 items-center justify-between">
          <span>{tree.name}</span>
          <SquareButton
            icon="open-folder"
            onClick={async (e) => {
              e.stopPropagation();
              await openFolder(
                `${activeProjectPath}${Array.isArray(tree.children)
                  ? tree.path
                  : getFolderNameFromFilePath(tree.path)
                }`
              );
            }}
            className="w-5 h-5 ml-auto bg-transparent group  opacity-0 group-hover:opacity-100 hover:bg-transparent"
            iconSize={20}
          />
        </div>
      </div>
      {Array.isArray(tree.children) && (
        <TreeView.SubTree>
          {tree.children.map((child) => renderTreeItem(child))}
        </TreeView.SubTree>
      )}
    </TreeView.Item>
  );

  return (
    <div className="flex flex-col h-screen border-r border-0.5 min-w-[400px] max-w-[1200px]">
      <div className="flex p-2 space-x-2 items-center justify-start border-b border-0.5">
        <FolderTree className="w-8 h-8" />
        <h2 className="text-lg font-semibold">File Tree</h2>
      </div>
      {
        isLoadingCurrentProjectFileTree && <ProcessIndicator />
      }
      {
        currentProjectFileTreeError && <div>{currentProjectFileTreeError}</div>
      }
      <div className="overflow-y-scroll overflow-x-hidden">
        <nav aria-label="Files">
          <TreeView aria-label="Files" className="">
            {currentProjectFileTree && renderTreeItem(currentProjectFileTree)}
          </TreeView>
        </nav>
      </div>
    </div>
  );
}