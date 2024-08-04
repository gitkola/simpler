import React from 'react';
import { getFileNameFromPath } from '../utils/pathUtils';
import { Close } from './Icons';
import { useAppDispatch, useAppSelector } from '../store';
import { saveProjectOpenedFiles } from '../store/currentProjectSlice';

type TabContentProps = {
  path: string;
  isActive: boolean;
  children: React.ReactNode;
};

export const TabContent: React.FC<TabContentProps> = ({ children }) => {
  return children;
};

type TabsViewProps = {
  children: React.ReactNode;
};

const TabsView: React.FC<TabsViewProps> = ({ children }) => {
  const { currentProjectOpenedFiles } = useAppSelector((state) => state.currentProject);
  const dispatch = useAppDispatch();

  const handleTabClick = async (path: string) => {
    await dispatch(saveProjectOpenedFiles(currentProjectOpenedFiles.map((file) => {
      if (file.path === path) return { ...file, isActive: true };
      return { ...file, isActive: false };
    })));
  };

  const handleCloseTab = async (path: string) => {
    const newFiles = currentProjectOpenedFiles.filter((file) => file.path !== path);
    await dispatch(saveProjectOpenedFiles(newFiles));
  }

  const tabs = React.Children.map(children, (child, index) => {
    if (React.isValidElement(child) && child.props.path) {
      return (
        <button
          key={index}
          className={`flex items-center justify-between pl-4 pr-2 h-[40px] w-fit focus:outline-none whitespace-nowrap
            ${child.props.isActive
              ? 'border-blue-500 bg-blue-500 bg-opacity-50 hover:bg-opacity-70'
              : 'border-blue-300 bg-blue-300 bg-opacity-50 hover:bg-opacity-70'
            }`}
          onClick={async (e) => {
            if (e.type === 'click' && e.nativeEvent.which === 2) {
              await handleCloseTab(child.props.path);
              e.stopPropagation();
              return;
            }
            !child.props.isActive && await handleTabClick(child.props.path);
          }}
        >
          {getFileNameFromPath(child.props.path)}
          <div className="flex items-center justify-center w-6 h-6 ml-2 hover:bg-blue-500 bg-opacity-30 hover:bg-opacity-70"
            onClick={async (e) => {
              e.stopPropagation();
              await handleCloseTab(child.props.path);
            }}
          >
            <Close size={20} />
          </div>
        </button>
      );
    }
    return null;
  });

  const tabContent = React.Children.toArray(children).find((child) => (child as React.ReactElement).props.isActive);

  return (
    <div className="w-full flex flex-col overflow-auto">
      <div className="flex w-full h-[40px] overflow-x-auto overflow-y-hidden">{tabs}</div>
      <div className="flex-1 overflow-auto">{tabContent}</div>
    </div>
  );
};

export default TabsView;
