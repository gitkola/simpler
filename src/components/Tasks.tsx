import React from 'react';
import { IProjectState, IProjectTask } from '../types';
import { useAppDispatch, useAppSelector } from '../store';
import { saveProjectState } from '../store/currentProjectSlice';
import Textarea from './Textarea';
import { Select } from './Select';
import { appendToInputValue } from '../store/chatSlice';


const Tasks: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentProjectState: IProjectState | null = useAppSelector((state) => state.currentProject.currentProjectState);
  const tasks = currentProjectState?.tasks || [];

  const onSave = async (updatedTasks: IProjectTask[]) => {
    await dispatch(saveProjectState({ ...currentProjectState!, tasks: [...updatedTasks] }));
  };

  const handleChange = async (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>, id: number) => {
    const { name, value } = e.target;
    const updatedTasks = tasks.map(req =>
      req.id === id ? { ...req, [name]: value, updatedAt: Date.now() } : req
    );
    await onSave(updatedTasks);
  };

  const handleDelete = async (id: number) => {
    const updatedTasks = tasks.filter(req => req.id !== id);
    await onSave(updatedTasks);
  };

  const handleAddNew = async (task: string) => {
    if (task.trim()) {
      const now = Date.now();
      const newTask: IProjectTask = {
        id: now,
        task: task.trim(),
        status: 'todo',
        suggested_as_next_task: false,
      };
      const updatedTasks = [...tasks, newTask];
      await onSave(updatedTasks);
    }
  };

  const handleExecuteTask = async (task: IProjectTask) => {
    await handleChange({ target: { name: 'status', value: 'in_progress' } } as any, task.id);
    await dispatch(appendToInputValue(task?.task));
  };

  return (
    <div className="space-y-1 py-1 px-0.5">
      {tasks.map(task => (
        <div key={task.id} className="flex justify-between space-x-1">
          <div className="flex-1">
            <Textarea
              key={task?.id}
              initialValue={task?.task}
              onSave={(data) => handleChange({ target: { name: 'task', value: data } } as any, task.id)}
              onDelete={() => handleDelete(task.id)}
              placeholder="Enter a task..."
              rows={1}
              className={`${getColorByStatus(task.status)}`}
            />
          </div>
          <Select
            name="status"
            value={task.status}
            options={[
              'todo',
              'in_progress',
              'done',
            ]}
            onChange={(e) => handleChange(e, task.id)}
          />
          <button
            onClick={async () => await handleExecuteTask(task)}
            className={`h-8 px-2 py-1 rounded-md text-white ${task.suggested_as_next_task ? 'bg-indigo-500 hover:bg-indigo-700 hover:shadow-md' : 'bg-indigo-300'} `}
          >
            To Prompt
          </button>
        </div>
      ))}
      <Textarea
        initialValue={""}
        onAdd={handleAddNew}
        placeholder="Enter a new task..."
        rows={1}
        editing={true}
      />
    </div>
  );
};

export default Tasks;

const getColorByStatus = (status: string) => {
  switch (status) {
    case 'in_progress':
      return 'text-blue-500';
    case 'done':
      return 'text-green-500';
    case 'todo':
    default:
      return 'opacity-50';
  }
};