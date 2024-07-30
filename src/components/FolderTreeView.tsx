import { useEffect, useState } from "react";
import { TreeView } from "@primer/react";
import { useAppDispatch, useAppSelector } from "../store";
import { getFilteredProjectFiles } from "../utils/getFilteredProjectFiles";
import {
  getFolderNameFromFilePath,
  getFolderNameFromPath,
} from "../utils/pathUtils";
import { File } from "./Icons";
import SquareButton from "./SquareButton";
import { openFolder } from "../utils/openFolder";
import { handleClickOnFile } from "../store/currentProjectSlice";

export interface ITreeData {
  name: string;
  path: string;
  checked: number;
  isOpen?: boolean;
  children?: ITreeData[];
  selected?: boolean;
}

function getTreeData(
  absoluteFilePaths: string[],
  projectPath: string
): ITreeData {
  const root: ITreeData = {
    name: getFolderNameFromPath(projectPath),
    path: "/",
    checked: 0,
    children: [],
    isOpen: true,
  };

  absoluteFilePaths.forEach((filePath) => {
    if (filePath.includes(".DS_Store")) return;
    const parts = filePath
      .replace(`${projectPath}/`, "")
      .split("/")
      .filter(Boolean);
    let currentNode = root;

    parts.forEach((part, index) => {
      const isLastPart = index === parts.length - 1;
      const path = "/" + parts.slice(0, index + 1).join("/");
      let node = currentNode.children?.find((child) => child.name === part);

      if (!node) {
        node = {
          name: part,
          path: path,
          checked: 0,
          isOpen: isLastPart ? undefined : false,
          children: isLastPart ? undefined : [],
          selected: isLastPart ? false : undefined,
        };
        currentNode.children = currentNode.children || [];
        currentNode.children.push(node);
      } else if (isLastPart) {
        node.checked = 0;
        node.selected = false;
      }

      currentNode = node;
    });
  });

  return root;
}

const fetchTreeData = async (projectPath: string) => {
  if (typeof projectPath !== "string" || !projectPath) return null;
  const filteredFilePaths = await getFilteredProjectFiles(projectPath);
  const treeData = getTreeData(filteredFilePaths, projectPath);
  return treeData;
};

export default function FolderTreeView() {
  const activeProjectPath = useAppSelector(
    (state) => state.projects.activeProjectPath
  );
  const [treeData, setTreeData] = useState<any>(null);
  const dispatch = useAppDispatch();

  const loadTreeData = async () => {
    const data = await fetchTreeData(activeProjectPath!);
    setTreeData(data);
  };

  useEffect(() => {
    if (!activeProjectPath) return;
    loadTreeData();
  }, [activeProjectPath]);

  const renderTreeItem = (tree: ITreeData) => (
    <TreeView.Item
      key={tree.path}
      id={tree.path}
      onSelect={async () => {
        await dispatch(handleClickOnFile(`${activeProjectPath}${tree.path}`));
      }}
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
    <div className="flex-1 h-screen overflow-auto">
      <nav aria-label="Files">
        <TreeView aria-label="Files" className="p-0">
          {treeData && renderTreeItem(treeData)}
        </TreeView>
      </nav>
    </div>
  );
}