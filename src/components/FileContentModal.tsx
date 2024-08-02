import React, { useState, useEffect } from 'react';
import ProcessIndicator from './ProcessIndicator';
import { readFile } from '../utils/readFile';
import { useAppSelector } from '../store';
import Editor from './Editor';
import DiffViewer from './DiffViewer';

interface FileContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  path: string;
  content: string;
  language: string;
  isLoading: boolean;
  onSave: (content: string) => void;
}

const FileContentModal: React.FC<FileContentModalProps> = ({
  isOpen,
  onClose,
  path,
  content,
  language,
  isLoading,
  onSave,
}) => {
  const [editedContent, setEditedContent] = useState(content);
  const [suggestedContent, setSuggestedContent] = useState<string>("");
  const [isCompareMode, setIsCompareMode] = useState<boolean>(false);
  const [isLoadingFromDisk, setIsLoadingFromDisk] = useState<boolean>(false);
  const activeProjectPath = useAppSelector((state) => state.projects.activeProjectPath);
  const absolutePath = `${activeProjectPath!}/${path}`;

  const fetchContent = async (path: string) => {
    setIsLoadingFromDisk(true);
    const content = await readFile(path);
    setSuggestedContent(content);
    setIsLoadingFromDisk(false);
  };

  useEffect(() => {
    if (!absolutePath) return;
    fetchContent(absolutePath);
  }, [absolutePath]);

  useEffect(() => {
    setEditedContent(content);
  }, [content]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!isOpen) return null;

  const handleSave = async () => {
    onSave(editedContent);
  };

  return (
    <div
      className="fixed p-16 h-full inset-0 bg-black bg-opacity-50 flex-1 items-center justify-center z-10"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div
        className="flex flex-col bg-white rounded-lg max-h-[100%]"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="flex justify-between items-center px-4 py-2">
          <h2 className="text-xl font-semibold">{path}</h2>
          <div className="space-x-4">
            <button
              onClick={() => setIsCompareMode(!isCompareMode)}
              className="bg-yellow-500 hover:bg-yellow-300 rounded px-2 py-1 border"
            >
              {!isCompareMode ? 'Compare' : 'Edit'}
            </button>
            {editedContent !== content &&
              (
                <button
                  onClick={() => setEditedContent(content)}
                  className="text-gray-500 hover:text-gray-700 rounded px-2 py-1 border"
                >
                  Cancel
                </button>
              )
            }
            {editedContent !== content &&
              (
                <button
                  onClick={async () => await handleSave()}
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  Save
                </button>
              )
            }
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>
        </div>
        <div className=' overflow-y-auto'>
          {(isLoading || isLoadingFromDisk) && (
            <ProcessIndicator />
          )}
          {
            !isCompareMode ? <Editor
              value={editedContent}
              language={language}
              onChange={(evn) => setEditedContent(evn.target.value)}
            /> : (
              <DiffViewer
                oldValue={editedContent}
                newValue={suggestedContent}
                language={language}
              />)
          }
        </div>
      </div>
    </div>
  );
};

export default FileContentModal;