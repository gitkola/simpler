import React, { useState, useEffect } from 'react';
import CodeEditor from '@uiw/react-textarea-code-editor';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
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
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  useEffect(() => {
    setEditedContent(content);
  }, [content]);

  if (!isOpen) return null;

  const handleSave = async () => {
    await onSave(editedContent);
    setEditMode(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">{fileName}</h2>
          <div>
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="text-blue-500 hover:text-blue-700 mr-4"
              >
                Edit
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>
        </div>
        <div className="flex-grow overflow-auto p-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Spinner size="lg" color="blue" />
            </div>
          ) : editMode ? (
            <div className="h-full">
              <CodeEditor
                value={editedContent}
                language={language}
                placeholder=""
                onChange={(evn) => setEditedContent(evn.target.value)}
                padding={15}
                style={{
                  backgroundColor: "#000",
                  fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                }}
                data-color-mode={'dark'}
              />
            </div>
          ) : (
            <SyntaxHighlighter
              language={language}
              style={vscDarkPlus}
              customStyle={{ margin: 0 }}
            >
              {editedContent}
            </SyntaxHighlighter>
          )}
        </div>
        {editMode && (
          <div className="flex justify-end p-4 border-t">
            <button
              onClick={() => setEditMode(false)}
              className="text-gray-500 hover:text-gray-700 mr-4"
            >
              Cancel
            </button>
            <button
              onClick={async () => await handleSave()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileContentModal;