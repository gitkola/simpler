import CodeEditor from '@uiw/react-textarea-code-editor';
import { useEffect, useState } from 'react';
import { readFile } from '../utils/readFile';
import ProcessIndicator from './ProcessIndicator';

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
    if (!path) return;
    fetchContent(path);
  }, [path]);

  const handleSaveFile = async () => {
    console.log('Save', path, editedContent);
  }

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
      handleSaveFile();
    }
  };

  return (
    <div className="">
      {
        isLoading ? (<ProcessIndicator />) : (
          editedContent && <CodeEditor
            value={editedContent}
            language={language}
            onChange={(e) => setEditedContent(e.target.value)}
            style={{
              fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
            }}
            data-color-mode={'light'}
            onKeyDown={handleOnKeyDown}
          />
        )
      }
    </div>
  );
}