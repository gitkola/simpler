import { useAppSelector } from '../store';
import Editor from './Editor';

export const ProjectState = () => {
  const currentProjectState = useAppSelector((state) => state.currentProject.currentProjectState);
  console.log({ currentProjectState });

  if (!currentProjectState) return null;
  return (<Editor
    value={JSON.stringify(currentProjectState, null, 2) || ""}
    language={'json'}
    minHeight={24}
    style={{
      marginLeft: 25,
      lineHeight: 1.6,
    }}
    disabled={true}
  />);
};