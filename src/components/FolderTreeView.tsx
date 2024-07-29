import { useEffect, useState } from "react";
import { TreeView } from '@primer/react'
import { useAppSelector } from "../store";
import { getFilteredProjectFiles } from "../utils/getFilteredProjectFiles";
import { getFolderNameFromFilePath, getFolderNameFromPath } from "../utils/pathUtils";
import { File } from "./Icons";
import SquareButton from "./SquareButton";
import { openFolder } from "../utils/openFolder";

interface ITreeData {
  name: string;
  path: string;
  checked: number;
  isOpen?: boolean;
  children?: ITreeData[];
}

function getTreeData(absoluteFilePaths: string[], projectPath: string): ITreeData {
  const root: ITreeData = {
    name: getFolderNameFromPath(projectPath),
    path: '/',
    checked: 0,
    children: [],
    isOpen: true,
  };

  absoluteFilePaths.forEach(filePath => {
    if (filePath.includes(".DS_Store")) return;
    const parts = filePath.replace(`${projectPath}/`, "").split('/').filter(Boolean);
    let currentNode = root;

    parts.forEach((part, index) => {
      const isLastPart = index === parts.length - 1;
      const path = '/' + parts.slice(0, index + 1).join('/');
      let node = currentNode.children?.find(child => child.name === part);

      if (!node) {
        node = {
          name: part,
          path: path,
          checked: 0,
          isOpen: isLastPart ? undefined : false,
          children: isLastPart ? undefined : []
        };
        currentNode.children = currentNode.children || [];
        currentNode.children.push(node);
      } else if (isLastPart) {
        node.checked = 0;
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
  const activeProjectPath = useAppSelector((state) => state.projects.activeProjectPath);
  const [treeData, setTreeData] = useState<any>(null);

  const loadTreeData = async () => {
    const data = await fetchTreeData(activeProjectPath!);
    setTreeData(data);
  };

  useEffect(() => {
    if (!activeProjectPath) return;
    loadTreeData();
  }, [activeProjectPath]);

  const renderTree = (tree: ITreeData) => (
    <TreeView.Item
      key={tree.name}
      id={tree.name}
      className={`bg-gray-800 hover:bg-blue-800 select-none ${tree.checked === 1 && "bg-purple-800"}`}
      expanded={tree.isOpen}
      onExpandedChange={(isExpanded) => {
        if (typeof (tree.isOpen) === 'boolean') {
          tree.isOpen = isExpanded;
          setTreeData({ ...treeData });
        }
      }}
      onSelect={() => {
        console.log("Selected", tree);
        if (Array.isArray(tree.children) && typeof (tree.isOpen) === 'boolean') {
          tree.isOpen = !tree.isOpen;
          setTreeData({ ...treeData });
        }
      }}
    >
      <TreeView.LeadingVisual>
        {tree.children === undefined ? (<File size={20} />) : (<TreeView.DirectoryIcon />)}
      </TreeView.LeadingVisual>
      <div className="flex items-center justify-between p-0">
        {tree.name}
        <SquareButton
          icon="open-folder"
          onClick={async (e) => {
            e.stopPropagation();
            await openFolder(`${activeProjectPath}${Array.isArray(tree.children) ? tree.path : getFolderNameFromFilePath(tree.path)}`);
          }}
          className="w-6 h-6 bg-transparent hover:bg-blue-900"
          iconSize={16}
          iconClassName=""
        />
      </div>
      {Array.isArray(tree.children) && (
        <TreeView.SubTree>
          {tree.children.map((child) => renderTree(child))}
        </TreeView.SubTree>
      )}
    </TreeView.Item>
  );

  return (
    <div className="flex-1 h-screen overflow-auto text-gray-200">
      <nav aria-label="Files">
        <TreeView aria-label="Files" className="p-0">
          {treeData && renderTree(treeData)}
        </TreeView>
      </nav>
      {/* <pre>{JSON.stringify(treeData, null, 2)}</pre> */}
    </div>
  );
}