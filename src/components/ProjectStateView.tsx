import React from 'react';
import { RootState, useAppSelector } from '../store';
import Requirements from './Requirements';
import Accordion from './Accordion';
import Tasks from './Tasks';
import { Files } from './Files';
import { ProjectState } from './ProjectState';
import Descriptions from './Descriptions';
import { ProjectMessages } from './ProjectMessages';



const ProjectStateView: React.FC = () => {
  const projectState = useAppSelector((state: RootState) => state?.currentProject?.currentProjectState);
  if (!projectState) return null;

  return (
    <div className="flex flex-col h-screen overflow-auto">
      <div className="h-full p-1 space-y-1 overflow-y-auto">
        <Accordion
          title={`Descriptions (${projectState?.descriptions?.length || 0})`}
          content={
            <Descriptions />
          }
        />
        <Accordion
          title={`Requirements (${projectState?.requirements?.length || 0})`}
          content={<Requirements />}
        />
        <Accordion
          title={`Tasks (${projectState?.tasks?.length || 0})`}
          content={<Tasks />}
        />
        <Accordion
          title={`Files (${projectState?.files?.length || 0})`}
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