import React from 'react';
import { RootState, useAppSelector } from '../store';
import { ProjectState } from './ProjectState';
import { Braces } from './Icons';
import ProcessIndicator from './ProcessIndicator';


const ProjectStateView: React.FC = () => {
  const { isLoadingCurrentProjectState, currentProjectStateError } = useAppSelector((state: RootState) => state?.currentProject);

  return (
    <div className="flex flex-col h-screen border-r border-0.5 w-[900px]">
      <div className="flex p-2 space-x-2 items-center justify-start border-b border-0.5">
        <Braces className="w-8 h-8" />
        <h2 className="text-lg font-semibold">Project State</h2>
      </div>
      {isLoadingCurrentProjectState && <ProcessIndicator />}
      {currentProjectStateError && <div className="mx-auto mt-2 px-2 py-1 rounded-md bg-red-400 text-red-700 z-100">{currentProjectStateError}</div>}
      <div className="h-full p-1 space-y-1 overflow-y-scroll">
        <ProjectState />
      </div>
    </div>
  );
};

export default ProjectStateView;