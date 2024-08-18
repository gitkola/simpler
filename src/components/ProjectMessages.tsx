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
    <div className="p-2">
      <Editor
        value={stringifiedMessages}
        language={'json'}
        minHeight={24}
        style={{
          // marginLeft: 25,
          // lineHeight: 1.6,
        }}
        disabled={true}
      />
    </div>
  );
};