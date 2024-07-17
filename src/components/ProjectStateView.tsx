import React, { useState } from 'react';
import { ChevronRight, ChevronDown, File } from './Icons';
import { IProjectState, ProjectFile, Requirement, ProjectTask } from '../types';

interface ProjectStateTreeProps {
  projectState: IProjectState;
  onItemClick: (item: string, type: string) => void;
}

const ProjectStateView: React.FC<ProjectStateTreeProps> = ({ projectState, onItemClick }) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    files: true,
    requirements: true,
    tasks: true,
    suggestedTasks: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const renderFile = (file: ProjectFile) => (
    <div
      key={file.path}
      className="flex items-center py-1 px-2 hover:bg-gray-100 cursor-pointer"
      onClick={() => onItemClick(file.path, 'file')}
    >
      <File className="mr-2 text-blue-500" />
      <span>{file.path}</span>
      <span className="text-xs text-gray-500 ml-auto">{file?.metadata?.status}</span>
    </div>
  );

  const renderRequirement = (req: Requirement) => (
    <div
      key={req.id}
      className={`flex items-center py-1 px-2 hover:bg-gray-100 cursor-pointer ${req.status === 'completed' ? 'text-green-500' :
        req.status === 'in_progress' ? 'text-yellow-500' :
          'text-red-500'
        }`}
      onClick={() => onItemClick(req.id, 'requirement')}
    >
      <span>{req.description}</span>
    </div>
  );

  const renderTask = (task: ProjectTask, isSuggested: boolean = false) => (
    <div
      key={task.id}
      className={`flex items-center py-1 px-2 hover:bg-gray-100 cursor-pointer ${task.status === 'done' ? 'text-green-500' :
        task.status === 'in_progress' ? 'text-yellow-500' :
          'text-gray-500'
        }`}
      onClick={() => onItemClick(task.id, isSuggested ? 'suggestedTask' : 'task')}
    >
      <span>{task.description}</span>
    </div>
  );

  const renderSection = (title: string, content: any[] | string, renderItem: (item: any) => JSX.Element) => (
    <div className="mb-4">
      <div
        className="flex items-center cursor-pointer font-bold mb-2"
        onClick={() => toggleSection(title)}
      >
        {expandedSections[title] ? <ChevronDown className="mr-2" /> : <ChevronRight className="mr-2" />}
        {title} {Array.isArray(content) && content?.length > 0 && `(${content?.length})`}
      </div>
      {expandedSections[title] && (
        <div className="pl-4">
          {Array.isArray(content) && content?.map(renderItem)}
          {typeof content === 'string' && content}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white h-full overflow-y-auto p-4 no-scrollbar">
      <h2 className="text-xl font-bold mb-4">{projectState?.name}</h2>
      {renderSection('Description', projectState?.description, renderFile)}
      {renderSection('Files', projectState?.files, renderFile)}
      {renderSection('Requirements', projectState?.requirements, renderRequirement)}
      {renderSection('Tasks', projectState?.tasks, renderTask)}
      {renderSection('Suggested Tasks', projectState?.suggested_tasks || [], (task) => renderTask(task, true))}
    </div>
  );
};

export default ProjectStateView;