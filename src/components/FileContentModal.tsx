import React, { useState, useEffect } from 'react';
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

  const handleSave = () => {
    onSave(editedContent);
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
                className="mr-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
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
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full h-full p-2 border rounded"
              style={{ minHeight: '300px' }}
            />
          ) : (
            <SyntaxHighlighter
              language={language}
              style={vscDarkPlus}
              customStyle={{ margin: 0 }}
            >
              {content}
            </SyntaxHighlighter>
          )}
        </div>
        {editMode && (
          <div className="flex justify-end p-4 border-t">
            <button
              onClick={() => setEditMode(false)}
              className="mr-2 px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
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