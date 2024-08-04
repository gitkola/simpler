import { useAppSelector } from '../store';
import Editor from './Editor';

export const ProjectMessages = () => {
  const currentProjectMessages = useAppSelector((state) => state.currentProject.currentProjectMessages);
  return (
    <Editor
      value={JSON.stringify(currentProjectMessages, null, 2) || ""}
      language={'json'}
      minHeight={24}
      style={{
        marginLeft: 25,
        lineHeight: 1.6,
      }}
      disabled={true}
    />
  );
};