import React, { useMemo } from 'react';
import { useAppSelector } from '../store';
import Editor from './Editor';

export const ProjectState = React.memo(() => {
  const currentProjectState = useAppSelector((state) => state.currentProject.currentProjectState);

  const stringifiedState = useMemo(() => {
    if (!currentProjectState) return '';
    return JSON.stringify(currentProjectState, null, 2);
  }, [currentProjectState]);

  if (!currentProjectState) return null;
  return (
      <Editor
        value={stringifiedState}
        language={'json'}
        disabled={true}
      />
  );
});