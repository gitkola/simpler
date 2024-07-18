import React, { useState } from 'react';
import { ChevronRight, ChevronDown, File } from './Icons';
import { IProjectState, ProjectFile, Requirement, ProjectTask } from '../types';
import { RootState, useAppDispatch, useAppSelector } from '../store';
import { saveProjectStateToFile } from '../store/currentProjectSlice';

export interface IProjectStateTreeProps {
  onItemClick: (item: string, type: string) => void;
}

export const renderEditable = (value: string, onSave: (data: string) => void, placeholder: string) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedValue, setEditedValue] = useState(value);

  if (isEditMode) {
    return (
      <div>
        <textarea
          value={editedValue}
          onChange={(e) => setEditedValue(e.target.value)}
          className="flex items-center p-2 hover:bg-white cursor-pointer rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm no-scrollbar"
          placeholder={placeholder}
          rows={8}
        />
        <button
          onClick={() => {
            onSave(editedValue);
            setIsEditMode(false);
          }}
          className="bg-blue-500 text-white p-2 rounded-md mt-2"
        >
          Save
        </button>
      </div>
    )
  }
  return (
    <span
      onClick={() => setIsEditMode(!isEditMode)}
      className="flex items-center p-2 hover:bg-white cursor-pointer rounded-md"
    >
      {value}
    </span>);
};

const ProjectStateView: React.FC<IProjectStateTreeProps> = ({ onItemClick }) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    files: true,
    requirements: true,
    tasks: true,
    suggestedTasks: true,
  });
  const dispatch = useAppDispatch();
  const { activeProjectPath } = useAppSelector((state: RootState) => state.projects);
  const projectState = useAppSelector((state: RootState) => state?.currentProject?.currentProjectState);

  if (!projectState) return null;
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const renderDescription = (description: string) => {
    return renderEditable(
      description,
      async (value) => {
        const updatedProjectState = { ...projectState, description: value };
        await dispatch(saveProjectStateToFile(activeProjectPath, updatedProjectState as IProjectState));
      },
      'Enter project description'
    );
    // return <span>{description}</span>;
  };

  const renderFile = (file: ProjectFile) => (
    <div
      key={file.path}
      className="flex items-center py-1 px-2 hover:bg-white cursor-pointer"
      onClick={() => onItemClick(file.path, 'file')}
    >
      <File className="mr-2 text-blue-500" />
      <span>{file?.path}</span>
      <span className="text-xs text-gray-500 ml-auto">{file?.metadata?.status}</span>
    </div>
  );

  const renderRequirement = (req: Requirement) => (
    <div
      key={req.id}
      className={`flex items-center py-1 px-2 hover:bg-white rounded-md cursor-pointer ${req.status === 'completed' ? 'text-green-500' :
        req.status === 'in_progress' ? 'text-yellow-500' :
          'text-red-500'
        }`}
      onClick={() => onItemClick(req.id, 'requirement')}
    >
      <span>{req.description}</span>
    </div>
  );

  const renderTasks = (task: ProjectTask, isSuggested: boolean = false) => (
    <div
      key={task.id}
      className={`flex items-center py-1 px-2 hover:bg-white rounded-md cursor-pointer ${task.status === 'done' ? 'text-green-500' :
        task.status === 'in_progress' ? 'text-yellow-500' :
          'text-gray-500'
        }`}
      onClick={() => onItemClick(task.id, isSuggested ? 'suggestedTask' : 'task')}
    >
      <span>{task.description}</span>
    </div>
  );

  const renderSection = (title: string, content: any[] | string, renderItem: (item: any) => JSX.Element) => (
    <div className="p-2 hover:bg-gray-200">
      <div
        className="flex items-center cursor-pointer font-bold"
        onClick={() => toggleSection(title)}
      >
        {expandedSections[title] ? <ChevronDown className="mr-2" /> : <ChevronRight className="mr-2" />}
        {title} {Array.isArray(content) && content?.length > 0 && `(${content?.length})`}
      </div>
      {expandedSections[title] && (
        <div className="">
          {Array.isArray(content) && content.map(renderItem)}
          {typeof content === 'string' && renderItem(content)}
        </div>
      )}
    </div>
  );

  return (
    <div className="h-full overflow-y-auto no-scrollbar">
      {renderSection('Description', projectState?.description || [], renderDescription)}
      {renderSection('Requirements', projectState?.requirements || [], renderRequirement)}
      {renderSection('Tasks', projectState?.tasks || [], renderTasks)}
      {renderSection('Suggested Tasks', projectState?.suggested_tasks || [], (task) => renderTasks(task, true))}
      {renderSection('Files', projectState?.files || [], renderFile)}
    </div>
  );
};

export default ProjectStateView;