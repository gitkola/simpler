import React, { useEffect, useState } from 'react';
import { IProjectState, IProjectRequirement } from '../types';
import { useAppDispatch, useAppSelector } from '../store';
import { saveProjectState } from '../store/currentProjectSlice';
import Textarea from './Textarea';


const Requirements: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentProjectState: IProjectState | null = useAppSelector((state) => state.currentProject.currentProjectState);
  const initialRequirements = currentProjectState?.requirements || [];
  const [requirements, setRequirements] = useState<IProjectRequirement[]>(initialRequirements);

  useEffect(() => {
    setRequirements(initialRequirements);
  }, [initialRequirements]);

  const onSave = async (updatedRequirements: IProjectRequirement[]) => {
    await dispatch(saveProjectState({ ...currentProjectState!, requirements: [...updatedRequirements] }));
  };

  const handleChange = async (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>, id: number) => {
    const { name, value } = e.target;
    const updatedRequirements = requirements.map(req =>
      req.id === id ? { ...req, [name]: value, updatedAt: Date.now() } : req
    );
    setRequirements(updatedRequirements);
    await onSave(updatedRequirements);
  };

  const handleDelete = async (id: number) => {
    const updatedRequirements = requirements.filter(req => req.id !== id);
    setRequirements(updatedRequirements);
    await onSave(updatedRequirements);
  };

  const handleAddNew = async (requirement: string) => {
    if (requirement.trim()) {
      const now = Date.now();
      const newReq: IProjectRequirement = {
        id: now,
        requirement: requirement.trim(),
      };
      const updatedRequirements = [...requirements, newReq];
      await onSave(updatedRequirements);
      setRequirements(updatedRequirements);
    }
  };

  return (
    <div className="space-y-1 py-1">
      {requirements.map(requirement => (
        <div key={requirement.id} className="flex-1 justify-between space-x-1">
          <Textarea
            key={requirement.id}
            initialValue={requirement?.requirement}
            onSave={(data) => handleChange({ target: { name: 'description', value: data } } as any, requirement.id)}
            onDelete={() => handleDelete(requirement.id)}
            placeholder="Enter a requirement..."
            rows={1}
          />
          {/* {requirement?.update && <span className={`px-2 py-1 text-sm`}>{requirement.update}</span>} */}
        </div>
      ))}
      <Textarea
        initialValue={""}
        onAdd={handleAddNew}
        placeholder="Enter a new requirement..."
        rows={1}
        editing={true}
      />
    </div>
  );
};

export default Requirements;