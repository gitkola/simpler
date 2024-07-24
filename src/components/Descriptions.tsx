import React, { useState } from 'react';
import { IProjectState, IProjectDescription } from '../types';
import { useAppDispatch, useAppSelector } from '../store';
import { saveProjectState } from '../store/currentProjectSlice';
import Textarea from './Textarea';


const Descriptions: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentProjectState: IProjectState | null = useAppSelector((state) => state.currentProject.currentProjectState);
  const initialDescriptions = currentProjectState?.descriptions || [];
  const [descriptions, setDescriptions] = useState<IProjectDescription[]>(initialDescriptions);

  const onSave = async (updatedDescriptions: IProjectDescription[]) => {
    await dispatch(saveProjectState({ ...currentProjectState!, descriptions: [...updatedDescriptions] }));
  };

  const handleChange = async (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>, id: number) => {
    const { name, value } = e.target;
    const updatedDescriptions = descriptions.map(req =>
      req.id === id ? { ...req, [name]: value, updatedAt: Date.now() } : req
    );
    setDescriptions(updatedDescriptions);
    await onSave(updatedDescriptions);
  };

  const handleDelete = async (id: number) => {
    const updatedDescriptions = descriptions.filter(req => req.id !== id);
    setDescriptions(updatedDescriptions);
    await onSave(updatedDescriptions);
  };

  const handleAddNew = async (description: string) => {
    if (description.trim()) {
      const now = Date.now();
      const newReq: IProjectDescription = {
        id: now,
        description: description.trim(),
      };
      const updatedDescriptions = [...descriptions, newReq];
      await onSave(updatedDescriptions);
      setDescriptions(updatedDescriptions);
    }
  };

  return (
    <div className="space-y-1 p-1">
      {descriptions.map(description => (
        <div key={description.id} className="flex-1 justify-between space-x-1">
          <Textarea
            key={description.id}
            initialValue={description?.description}
            onSave={(data) => handleChange({ target: { name: 'description', value: data } } as any, description.id)}
            onDelete={() => handleDelete(description.id)}
            placeholder="Enter a description..."
            rows={1}
          />
          {/* {description?.update && <span className={`px-2 py-1 text-sm`}>{description.update}</span>} */}
        </div>
      ))}
      <Textarea
        initialValue={""}
        onAdd={handleAddNew}
        placeholder="Enter a new description..."
        rows={1}
        editing={true}
      />
    </div>
  );
};

export default Descriptions;