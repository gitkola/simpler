import React from 'react';
import { RootState, useAppDispatch, useAppSelector } from '../store';
import { Files } from './Icons';
import ProcessIndicator from './ProcessIndicator';
import { Files as FilesComponent } from './Files';
import { handleSyncFilesFromFS } from '../store/currentProjectSlice';

const ProjectFilesView: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentProjectState, isLoadingCurrentProjectState, currentProjectStateError } = useAppSelector((state: RootState) => state?.currentProject);

  return (
    <div className="flex flex-col border-r border-0.5 min-w-[700px] max-w-[1200px]">
      <div className="flex p-2 space-x-2 items-center justify-between border-b border-0.5">
        <div className="flex items-center justify-start">
          <Files className="w-8 h-8" />
          <h2 className="text-lg font-semibold">Project Files</h2>
          <span className="text-sm text-gray-500">{`(${currentProjectState?.files?.length || 0})`}</span>
        </div>
        <button
          className="px-3 bg-orange-500 hover:bg-orange-700 text-white font-bold rounded-full"
          onClick={async () => await dispatch(handleSyncFilesFromFS())}
        >
          Sync Files from Disk
        </button>
      </div>
      {isLoadingCurrentProjectState && <ProcessIndicator />}
      {currentProjectStateError && <div className="mx-auto mt-2 px-2 py-1 rounded-md bg-red-400 text-red-700 z-100">{currentProjectStateError}</div>}
      <div className="overflow-y-scroll overflow-x-hidden">
        <FilesComponent />
      </div>
    </div>
  );
};

export default ProjectFilesView;