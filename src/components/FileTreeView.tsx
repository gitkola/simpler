import { TreeView } from "@primer/react";
import { useAppDispatch, useAppSelector } from "../store";
import {
  getFolderNameFromFilePath,
} from "../utils/pathUtils";
import { File, Files } from "./Icons";
import SquareButton from "./SquareButton";
import { openFolder } from "../utils/openFolder";
import { handleClickOnFile, handleClickOnFolder, ITreeData } from "../store/currentProjectSlice";
import ProcessIndicator from "./ProcessIndicator";

const treeItemIsFile = (tree: ITreeData) => Array.isArray(tree.children) === false;

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
      <TreeView.LeadingVisual label={tree.name}>
        {tree.children === undefined ? (
          <File size={20} />
        ) : (
          <TreeView.DirectoryIcon />
        )}
      </TreeView.LeadingVisual>
      <div className="flex">
        {tree.name}
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
          className="w-5 h-5 ml-auto bg-transparent hover:bg-transparent"
          iconSize={20}
        />
      </div>
      {Array.isArray(tree.children) && (
        <TreeView.SubTree>
          {tree.children.map((child) => renderTreeItem(child))}
        </TreeView.SubTree>
      )}
    </TreeView.Item>
  );

  return (
    <div className="flex flex-col h-screen">
      <div className="flex p-2 space-x-2 items-center justify-start border-b-2">
        <Files className="w-8 h-8" />
        <h2 className="text-lg font-semibold">Files</h2>
      </div>
      {
        isLoadingCurrentProjectFileTree && <ProcessIndicator />
      }
      {
        currentProjectFileTreeError && <div>{currentProjectFileTreeError}</div>
      }
      <nav aria-label="Files">
        <TreeView aria-label="Files" className="p-0">
          {currentProjectFileTree && renderTreeItem(currentProjectFileTree)}
        </TreeView>
      </nav>
    </div>
  );
}