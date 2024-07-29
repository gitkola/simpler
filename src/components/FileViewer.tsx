import CodeEditor from '@uiw/react-textarea-code-editor';
import { useEffect, useState } from 'react';
import Spinner from './Spinner';
import { readFile } from '../utils/readFile';

interface FileViewerProps {
  path: string;
}

export default function FileViewer({ path }: FileViewerProps) {
  const [editedContent, setEditedContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [language, setLanguage] = useState<string>('txt');

  const fetchContent = async (path: string) => {
    setIsLoading(true);
    const content = await readFile(path);
    setEditedContent(content);
    setIsLoading(false);
    setLanguage(path.split('.').pop() || 'txt');
  };

  useEffect(() => {
    fetchContent(path);
  }, [path]);

  return (
    <div className="flex-1 flex-col h-full">
      {
        isLoading ? (
          <div className="flex justify-center items-center">
            <Spinner size="lg" color="blue" />
          </div>
        ) : (
          editedContent && <CodeEditor
            value={editedContent}
            language={language}
            onChange={(e) => setEditedContent(e.target.value)}
            style={{
              fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
            }}
            data-color-mode={'dark'}
          />
        )
      }
    </div>
  );
}