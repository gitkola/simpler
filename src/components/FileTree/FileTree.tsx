import React from 'react';
import { FileTreeProps, FileTreeItemProps, SelectionState } from './fileTreeInterfaces';
import { ThreeStateCheckbox } from './ThreeStateCheckbox';

export const FileTree: React.FC<FileTreeProps> = ({ data, onToggle, onSelect, onFileClick }) => {
  return (
    <FileTreeItem item={data!} onToggle={onToggle} onSelect={onSelect} onFileClick={onFileClick} />
  );
};

const FileTreeItem: React.FC<FileTreeItemProps> = ({ item, onToggle, onSelect, onFileClick }) => {
  const handleToggle = () => {
    onToggle(item?.path);
  };

  const handleSelect = (state: SelectionState) => {
    onSelect(item?.path, state);
  };

  const handleClick = () => {
    if (!item.isFolder) {
      onFileClick(item);
    } else {
      handleToggle();
    }
  };

  return (
    <div className="flex flex-col pl-4">
      <div
        className="flex w-full space-x-2 items-center justify-between hover:bg-gray-300 p-1"
        onClick={handleClick}
      >
        <div className="space-x-2">
          {item.isFolder && (
            <span className="toggle">
              {item.isOpen ? '▼' : '▶'}
            </span>
          )}
          <span className="name">{item?.path?.split('/').pop()}</span>
        </div>
        <ThreeStateCheckbox
          checked={item.selected}
          onChange={handleSelect}
        />
      </div>
      {item.isFolder && item.isOpen && item.children && (
        <div className="file-tree-item-children">
          {item?.children?.map((child) => (
            <FileTreeItem
              key={child.path}
              item={child}
              onToggle={onToggle}
              onSelect={onSelect}
              onFileClick={onFileClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};