import React from 'react';
import { FlatFileTree } from './FlatFileTree';
import { useFlatFileTree } from './useFlatFileTree';
import { useAppDispatch, useAppSelector } from '../../store';
import { handleClickOnFile } from '../../store/currentProjectSlice';

const FlatFileTreeExample: React.FC = () => {
  const {
    flatFileTree,
    handleToggle,
    handleSelect,
    getSelectedFiles
  } = useFlatFileTree();

  const activeProjectPath = useAppSelector((state) => state.projects.activeProjectPath);
  const dispatch = useAppDispatch();

  const handleFileClick = async (path: string) => {
    const filePathArray = path?.split("/");
    filePathArray.shift();
    const filePath = filePathArray.join("/");
    await dispatch(handleClickOnFile(`${activeProjectPath}/${filePath}`));
  };

  return (
    <div>
      <FlatFileTree
        data={flatFileTree}
        onToggle={handleToggle}
        onSelect={handleSelect}
        onFileClick={handleFileClick}
      />

      <h2>Selected Files</h2>
      <pre>{JSON.stringify(getSelectedFiles(), null, 2)}</pre>
    </div>
  );
};

export default FlatFileTreeExample;