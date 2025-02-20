import { useMemo } from 'react';
import { useAppSelector } from '../store';
import Editor from './Editor';

export const ProjectMessages = () => {
  const currentProjectMessages = useAppSelector((state) => state.currentProject.currentProjectMessages);

  const stringifiedMessages = useMemo(() => {
    if (!currentProjectMessages) return '';
    return JSON.stringify(currentProjectMessages, null, 2);
  }, [currentProjectMessages]);
  return (
    <Editor
      value={stringifiedMessages}
      language={'json'}
      disabled={true}
    />
  );
};