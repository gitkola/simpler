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
    <div className="">
      <Editor
        value={stringifiedState}
        language={'json'}
        minHeight={24}
        style={{
          paddingLeft: 8,
          paddingRight: 8,
          paddingBottom: 4,
          paddingTop: 4,
        }}
        disabled={true}
      />
    </div>
  );
});