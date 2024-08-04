import React from 'react';
import { FileTree } from './FileTree';
import { useFileTree } from './useFileTree';
import { RootState, useAppDispatch, useAppSelector } from '../../store';
import { IFileTreeState } from './fileTreeInterfaces';
import { handleClickOnFile } from '../../store/currentProjectSlice';

const FileTreeExample: React.FC = () => {
  const { fileTree, handleToggle, handleSelect, getSelectedFiles } = useFileTree();
  const activeProjectPath = useAppSelector((state: RootState) => state.projects.activeProjectPath);
  const dispatch = useAppDispatch();

  const handleClickTreeItem = async (tree: IFileTreeState) => {
    if (!tree.isFolder) {
      const filePathArray = tree.path?.split("/");
      filePathArray.shift();
      const filePath = filePathArray.join("/");
      await dispatch(handleClickOnFile(`${activeProjectPath}/${filePath}`));
    } else {
      handleToggle(tree.path);
    };
  }

  return (
    <div>
      <FileTree
        data={fileTree}
        onToggle={handleToggle}
        onSelect={handleSelect}
        onFileClick={handleClickTreeItem}
      />

      <h2>Selected Files</h2>
      <pre>{JSON.stringify(getSelectedFiles(), null, 2)}</pre>
    </div>
  );
};

export default FileTreeExample;