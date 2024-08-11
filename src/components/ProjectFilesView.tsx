import React from 'react';
import { RootState, useAppSelector } from '../store';
import { Files } from './Icons';
import ProcessIndicator from './ProcessIndicator';
import { Files as FilesComponent } from './Files';

const ProjectFilesView: React.FC = () => {
  const { currentProjectState, isLoadingCurrentProjectState, currentProjectStateError } = useAppSelector((state: RootState) => state?.currentProject);

  return (
    <div className="flex flex-col h-screen border-r border-0.5 min-w-[700px]">
      <div className="flex p-2 space-x-2 items-center justify-start border-b border-0.5">
        <Files className="w-8 h-8" />
        <h2 className="text-lg font-semibold">Project Files</h2>
        <span className="text-sm text-gray-500">{`(${currentProjectState?.files?.length || 0})`}</span>
      </div>
      {isLoadingCurrentProjectState && <ProcessIndicator />}
      {currentProjectStateError && <div className="mx-auto mt-2 px-2 py-1 rounded-md bg-red-400 text-red-700 z-100">{currentProjectStateError}</div>}
      <div className="h-full p-1 space-y-1 overflow-y-scroll">
        <FilesComponent />
      </div>
    </div>
  );
};

export default ProjectFilesView;