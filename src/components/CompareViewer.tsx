import { useEffect, useState } from 'react';
import { readFile } from '../utils/readFile';
import ProcessIndicator from './ProcessIndicator';
import { useAppSelector } from '../store';
import DiffViewer from './DiffViewer';

interface CompareViewerProps {
  path: string;
}

export default function CompareViewer({ path }: CompareViewerProps) {
  const [editedContent, setEditedContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>('txt');
  const activeProjectPath = useAppSelector((state) => state.projects.activeProjectPath);
  const files = useAppSelector((state) => state.currentProject.currentProjectState?.files) || [];
  const relativePath = path.replace(`${activeProjectPath!}/`, '');
  const suggestedContent = files?.find((file) => file.path === relativePath)?.content || "";

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

  return (
    <div>
      {isLoading && <ProcessIndicator />}
      <DiffViewer
        oldValue={editedContent}
        newValue={suggestedContent}
        language={language}
      />
    </div>
  );
}