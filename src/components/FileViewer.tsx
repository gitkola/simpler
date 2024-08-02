import React from 'react';
import { useEffect, useState } from 'react';
import { readFile } from '../utils/readFile';
import ProcessIndicator from './ProcessIndicator';
import { useAppDispatch, useAppSelector } from '../store';
import { IProjectState } from '../types';
import { saveProjectState } from '../store/currentProjectSlice';
import { writeFile } from '../utils/writeFile';
import Editor from './Editor';

interface FileViewerProps {
  path: string;
}

export default function FileViewer({ path }: FileViewerProps) {
  const [editedContent, setEditedContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [language, setLanguage] = useState<string>('txt');
  const activeProjectPath = useAppSelector((state) => state.projects.activeProjectPath);
  const currentProjectState = useAppSelector((state) => state.currentProject.currentProjectState);
  const files = currentProjectState?.files || [];
  const relativePath = path.replace(`${activeProjectPath!}/`, '');
  const dispatch = useAppDispatch();

  const fetchContent = async (path: string) => {
    setIsLoading(true);
    const content = await readFile(path);
    setEditedContent(content);
    setIsLoading(false);
    setLanguage(path.split('.').pop() || 'txt');
  };

  useEffect(() => {
    if (!path) return;
    fetchContent(path);
  }, [path]);

  const handleSaveFile = async () => {
    setIsLoading(true);
    const prevFile = files?.find((file) => file.path === relativePath);
    const updatedFile = { ...prevFile!, editedContent };
    const updatedFiles = files?.map(f => f.path === updatedFile.path ? updatedFile : f) || [];
    if (currentProjectState) {
      const updatedProjectState: IProjectState = {
        ...currentProjectState,
        files: [...updatedFiles],
      };
      await dispatch(saveProjectState(updatedProjectState));
    }
    await writeFile(editedContent, relativePath);
    setIsLoading(false);
  };

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
      handleSaveFile();
    }
  };

  return (
    <div className="">
      {isLoading && <ProcessIndicator />}
      {
        editedContent && <Editor
          value={editedContent}
          language={language}
          onChange={(e) => setEditedContent(e.target.value)}
          onKeyDown={handleOnKeyDown}
        />
      }
    </div>
  );
}