import React from 'react';
import { IFlatFileTreeState } from './flatFileTreeUtils';
import { SelectionState } from './fileTreeInterfaces';
import { ThreeStateCheckbox } from './ThreeStateCheckbox';

interface FlatFileTreeProps {
  data: IFlatFileTreeState;
  onToggle: (path: string) => void;
  onSelect: (path: string, state: SelectionState) => void;
  onFileClick: (path: string) => void;
}

export const FlatFileTree: React.FC<FlatFileTreeProps> = ({ data, onToggle, onSelect, onFileClick }) => {
  const renderTree = (path: string = '') => {
    const children = Object.keys(data).filter(key => {
      const parentPath = key.substring(0, key.lastIndexOf('/'));
      return parentPath === path;
    });

    return (
      <ul>
        {children.map(childPath => {
          const item = data[childPath];
          return (
            <li key={childPath} className="flex flex-col pl-4">
              <div
                className="flex w-full space-x-2 items-center justify-between hover:bg-gray-300 p-1"
                onClick={() => !item.isFolder ? onFileClick(childPath) : onToggle(childPath)}
              >
                <div className="space-x-2">
                  {item.isFolder && (
                    <span className="toggle">
                      {item.isOpen ? '▼' : '▶'}
                    </span>
                  )}
                  <span className="name">
                    {childPath.split('/').pop()}
                  </span>
                </div>
                <ThreeStateCheckbox
                  checked={item.selected}
                  onChange={(state) => onSelect(childPath, state)}
                />
              </div>
              {item.isFolder && item.isOpen && renderTree(childPath)}
            </li>
          );
        })}
      </ul>
    );
  };

  return <div>{renderTree()}</div>;
};


