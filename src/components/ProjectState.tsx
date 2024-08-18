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
    <div className="p-2">
      <Editor
        value={stringifiedState}
        language={'json'}
        minHeight={24}
        style={{
          // marginLeft: 25,
          // lineHeight: 1.6,
          // overflowY: 'scroll',
        }}
        disabled={true}
      />
    </div>
  );
});