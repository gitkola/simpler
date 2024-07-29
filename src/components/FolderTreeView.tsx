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
import { IFile, saveProjectOpenedFiles } from "../store/currentProjectSlice";

interface ITreeData {
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
  const files: IFile[] = useAppSelector((state) => state.currentProject.currentProjectOpenedFiles) || [];
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
      className={`bg-gray-800 hover:bg-blue-500 select-none ${tree.selected === true && "bg-purple-800 hover:bg-purple-500"}`}
      expanded={tree.isOpen}
      onExpandedChange={(isExpanded) => {
        if (typeof tree.isOpen === "boolean") {
          tree.isOpen = isExpanded;
          setTreeData({ ...treeData });
        }
      }}
      onSelect={() => {
        if (Array.isArray(tree.children) && typeof tree.isOpen === "boolean") {
          tree.isOpen = !tree.isOpen;
          setTreeData({ ...treeData });
        } else {
          // tree.selected = !tree.selected;
          if (files.some((file) => file.path === `${activeProjectPath}${tree.path}`)) return;
          const newFiles: IFile[] = [...files, { path: `${activeProjectPath}${tree.path}` }];
          dispatch(saveProjectOpenedFiles(newFiles));
          // setTreeData({ ...treeData });
        }
      }}
      containIntrinsicSize="content-visiblity: auto"
    >
      <TreeView.LeadingVisual label={tree.name}>
        {tree.children === undefined ? (
          <File size={20} />
        ) : (
          <TreeView.DirectoryIcon />
        )}
      </TreeView.LeadingVisual>
      <div className="flex items-center justify-between">
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
          className="w-5 h-5 bg-transparent hover:text-white hover:bg-transparent"
          iconSize={60}
          iconClassName=""
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
    <div className="flex-1 h-screen overflow-auto text-gray-200">
      <nav aria-label="Files">
        <TreeView aria-label="Files" className="p-0">
          {treeData && renderTreeItem(treeData)}
        </TreeView>
      </nav>
      {/* <pre>{JSON.stringify(treeData, null, 2)}</pre> */}
    </div>
  );
}