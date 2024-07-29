import React, { useState, useEffect } from 'react';
import CodeEditor from '@uiw/react-textarea-code-editor';
import Spinner from './Spinner';

interface FileContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  content: string;
  language: string;
  isLoading: boolean;
  onSave: (content: string) => void;
}

const FileContentModal: React.FC<FileContentModalProps> = ({
  isOpen,
  onClose,
  fileName,
  content,
  language,
  isLoading,
  onSave,
}) => {
  const [editedContent, setEditedContent] = useState(content);

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
      className="fixed inset-0 bg-black bg-opacity-50 flex-1 items-center justify-center z-10"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div
        className="flex flex-col bg-white rounded-lg max-h-[80%] overflow-y-auto"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="flex justify-between items-center px-4 py-2">
          <h2 className="text-xl font-semibold">{fileName}</h2>
          <div className="space-x-4">
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
        <div>
          {
            isLoading ? (
              <div className="flex justify-center items-center p-16">
                <Spinner size="lg" color="blue" />
              </div>
            ) : (
              <CodeEditor
                value={editedContent}
                language={language}
                onChange={(evn) => setEditedContent(evn.target.value)}
                style={{
                  fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                }}
                data-color-mode={'dark'}
              />
            )
          }
        </div>
      </div>
    </div>
  );
};

export default FileContentModal;