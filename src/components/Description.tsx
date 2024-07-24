import { RootState, useAppDispatch, useAppSelector } from '../store';
import Textarea from './Textarea';
import { saveProjectState } from '../store/currentProjectSlice';
import { IProjectState } from '../types';


const Description = () => {
  const dispatch = useAppDispatch();
  const projectState = useAppSelector((state: RootState) => state?.currentProject?.currentProjectState);
  const description = projectState?.description || "";

  const onSave = async (text: string) => { await dispatch(saveProjectState({ ...projectState as IProjectState, description: text })); }

  return (
    <div className="p-1">
      <Textarea
        initialValue={description || ""} onSave={onSave} placeholder="Enter project description..."
      />
    </div>
  );
};

export default Description;