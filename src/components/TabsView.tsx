import React, { useState } from 'react';
import { getFileNameFromPath } from '../utils/pathUtils';
import { Close } from './Icons';
import { useAppDispatch, useAppSelector } from '../store';
import { saveProjectOpenedFiles } from '../store/currentProjectSlice';

type TabContentProps = {
  title: string;
  children: React.ReactNode;
};

export const TabContent: React.FC<TabContentProps> = ({ title, children }) => {
  return <div key={title}>{children}</div>;
};


type TabsViewProps = {
  children: React.ReactNode;
};

const TabsView: React.FC<TabsViewProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);
  const files = useAppSelector((state) => state.currentProject.currentProjectOpenedFiles) || [];
  const dispatch = useAppDispatch();
  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  const handleCloseTab = async (title: string) => {
    const newFiles = files.filter((file) => file.path !== title);
    await dispatch(saveProjectOpenedFiles(newFiles));
    setActiveTab(0);
  }

  const tabs = React.Children.map(children, (child, index) => {
    if (React.isValidElement(child) && child.props.title) {
      return (
        <button
          key={index}
          className={`flex items-center justify-between pl-4 pr-2 py-1 h-fit w-fit focus:outline-none ${index === activeTab
            ? 'border-blue-500 bg-blue-500 bg-opacity-50 hover:bg-opacity-70'
            : 'border-blue-300 bg-blue-300 bg-opacity-50 hover:bg-opacity-70'
            }`}
          onClick={() => handleTabClick(index)}
        >
          {getFileNameFromPath(child.props.title)}
          <div className="flex items-center justify-center w-6 h-6 ml-2 hover:bg-slate-400"
            onClick={async (e) => {
              e.stopPropagation();
              await handleCloseTab(child.props.title);
            }}
          >
            <Close size={20} />
          </div>
        </button>
      );
    }
    return null;
  });

  const tabContents = React.Children.toArray(children);

  return (
    <div className="h-screen flex flex-col">
      <div className="flex h-fit border-b border-0.5 border-gray-700 overflow-x-auto">{tabs}</div>
      <div className="flex-1 overflow-auto">{tabContents[activeTab]}</div>
    </div>
  );
};

export default TabsView;
