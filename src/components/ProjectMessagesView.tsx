import React from 'react';
import { RootState, useAppSelector } from '../store';
import { Messages } from './Icons';
import ProcessIndicator from './ProcessIndicator';
import { ProjectMessages } from './ProjectMessages';


const ProjectMessagesView: React.FC = () => {
  const { isLoadingCurrentProjectState, currentProjectStateError } = useAppSelector((state: RootState) => state?.currentProject);

  return (
    <div className="flex flex-col h-screen border-r border-0.5 min-w-[900px] w-[900px]">
      <div className="flex p-2 space-x-2 items-center justify-start border-b border-0.5">
        <Messages className="w-8 h-8" />
        <h2 className="text-lg font-semibold">Messages</h2>
      </div>
      {isLoadingCurrentProjectState && <ProcessIndicator />}
      {currentProjectStateError && <div className="mx-auto mt-2 px-2 py-1 rounded-md bg-red-400 text-red-700 z-100">{currentProjectStateError}</div>}
      <div className="h-full overflow-y-scroll">
        <ProjectMessages />
      </div>
    </div>
  );
};

export default ProjectMessagesView;