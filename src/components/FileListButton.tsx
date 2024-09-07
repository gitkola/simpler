import React, { useState, useRef, useEffect } from 'react';
import { outlineButtonBlue } from '../styles/styles';
import { RootState, useAppDispatch, useAppSelector } from '../store';
import { setProjectFilesInContext } from '../store/contextSlice';
import { readFile } from '../services/fsService';

export const FileListButton: React.FC = () => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const { projectFilesInContext } = useAppSelector((state: RootState) => state.context);
  const files = useAppSelector((state: RootState) => state.currentProject.currentProjectState?.files) || [];
  const { activeProjectPath } = useAppSelector((state: RootState) => state.projects);
  const dispatch = useAppDispatch();

  const handleClickOutside = (event: MouseEvent) => {
    if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
      setIsPopoverOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="">
      <button
        onClick={(e) => {
          e.nativeEvent.preventDefault();
          setIsPopoverOpen(!isPopoverOpen)
        }}
        className={`${outlineButtonBlue} pl-0`}
      >
        <div className={`flex items-center justify-center h-5 px-2 ml-0.5 font-bold text-white rounded-full ${Object.keys(projectFilesInContext).length > 0 ? 'bg-orange-500' : 'bg-gray-500'}`}>{Object.keys(projectFilesInContext).length}</div>
        <div>Files</div>
      </button>
      {isPopoverOpen && (
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex flex-col items-center justify-center ">
          <div ref={popoverRef} className="overflow-y-scroll overflow-x-hidden -top-[400px] -left-[600px] bg-white shadow-2xl shadow-gray-800 rounded-md z-10 h-[80%] w-[50%]">
            {
              files.map((file) => (
                <button
                  key={file.path}
                  onClick={async () => {
                    const newFiles = { ...projectFilesInContext };
                    if (newFiles[file.path]) {
                      delete newFiles[file.path];
                    } else {
                      const content = await readFile(`${activeProjectPath}/${file.path}`);
                      newFiles[file.path] = { ...file, content };
                    }
                    dispatch(setProjectFilesInContext(newFiles));
                  }}
                  className={`flex items-center w-full px-4 py-2 text-sm text-gray-800 border hover:border-blue-600 ${projectFilesInContext[file.path] ? 'bg-blue-300' : ''}`}
                >
                  {file.path}
                </button>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
};

