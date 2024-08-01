import React from 'react';
import { RootState, useAppSelector } from '../store';
import Requirements from './Requirements';
import Accordion from './Accordion';
import Tasks from './Tasks';
import { Files } from './Files';
import { ProjectState } from './ProjectState';
import Descriptions from './Descriptions';
import { ProjectMessages } from './ProjectMessages';
import { ProjectFolder } from './Icons';
import ProcessIndicator from './ProcessIndicator';


const ProjectStateView: React.FC = () => {
  const { currentProjectState, isLoadingCurrentProjectState, currentProjectStateError } = useAppSelector((state: RootState) => state?.currentProject);

  return (
    <div className="flex flex-col h-screen overflow-auto">
      <div className="flex p-2 space-x-2 items-center justify-start border-b-2">
        <ProjectFolder className="w-8 h-8" />
        <h2 className="text-lg font-semibold">{currentProjectState?.name}</h2>
      </div>
      {
        isLoadingCurrentProjectState && <ProcessIndicator />
      }
      {
        currentProjectStateError && <div>{currentProjectStateError}</div>
      }
      <div className="h-full p-1 space-y-1 overflow-y-auto">
        <Accordion
          title={`Descriptions (${currentProjectState?.descriptions?.length || 0})`}
          content={<Descriptions />}
        />
        <Accordion
          title={`Requirements (${currentProjectState?.requirements?.length || 0})`}
          content={<Requirements />}
        />
        <Accordion
          title={`Tasks (${currentProjectState?.tasks?.length || 0})`}
          content={<Tasks />}
        />
        <Accordion
          title={`Files (${currentProjectState?.files?.length || 0})`}
          content={<Files />}
        />
        <Accordion
          title="Project State"
          content={<ProjectState />}
        />
        <Accordion
          title="Project Messages"
          content={<ProjectMessages />}
        />
      </div>
    </div>
  );
};

export default ProjectStateView;