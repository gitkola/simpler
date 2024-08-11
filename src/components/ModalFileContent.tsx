import React, { useEffect, useState } from 'react';
import ProcessIndicator from './ProcessIndicator';
import { readFile } from '../services/fsService';
import { useAppDispatch, useAppSelector } from '../store';
import Editor from './Editor';
// import DiffViewer from './DiffViewer';
import { setFileInModal } from '../store/layoutSlice';

interface ModalFileContentProps {
  // isOpen: boolean;
  // onClose: () => void;
  // path: string;
  // content: string;
  // language: string;
  // isLoading: boolean;
  // onSave: (content: string) => void;
}

const ModalFileContent: React.FC<ModalFileContentProps> = ({
  // isOpen,
  // onClose,
  // path,
  // content,
  // language,
  // isLoading,
  // onSave,
}) => {
  const dispatch = useAppDispatch();
  const { fileInModal } = useAppSelector((state) => state.layout);
  const [editedContent, setEditedContent] = useState<string>('');
  // const [suggestedContent, setSuggestedContent] = useState<string | null>(null);
  // const [isCompareMode, setIsCompareMode] = useState<boolean>(false);
  const [isLoadingFromDisk, setIsLoadingFromDisk] = useState<boolean>(false);
  const activeProjectPath = useAppSelector((state) => state.projects.activeProjectPath);
  const absolutePath = `${activeProjectPath!}/${fileInModal?.path}`;

  const onClose = () => dispatch(setFileInModal(undefined));

  const fetchContentFromFS = async (path: string) => {
    setIsLoadingFromDisk(true);
    const content = await readFile(path);
    setEditedContent(content);
    setIsLoadingFromDisk(false);
  };

  useEffect(() => {
    if (!absolutePath || fileInModal?.content) return;
    fetchContentFromFS(absolutePath);
  }, [absolutePath, fileInModal?.content]);

  // useEffect(() => {
  //   setSuggestedContent(fileInModal?.content || null);
  // }, [fileInModal?.content]);

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

  // if (!isOpen) return null;

  // const handleSave = async () => {
  //   onSave(editedContent);
  // };

  return (
    <div
      className="fixed p-16 h-full inset-0 bg-black bg-opacity-50 flex-1 items-center justify-center z-10"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div
        className="flex flex-col bg-[#1f1f1f] rounded-lg max-h-[100%]"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="flex justify-between items-center px-4 py-2 border-b">
          <h2 className="text-xl font-semibold">{fileInModal?.path}</h2>
          <div className="space-x-4">
            {/* <button
              onClick={() => setIsCompareMode(!isCompareMode)}
              className="bg-yellow-600 hover:bg-yellow-400 rounded px-2 py-1 border"
            >
              {!isCompareMode ? 'Compare' : 'Edit'}
            </button> */}
            {/* {editedContent !== content &&
              (
                <button
                  onClick={() => setEditedContent(content)}
                  className="text-gray-500 hover:text-gray-700 rounded px-2 py-1 border"
                >
                  Cancel
                </button>
              )
            } */}
            {/* {editedContent !== content &&
              (
                <button
                  onClick={async () => await handleSave()}
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  Save
                </button>
              )
            } */}
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>
        </div>
        <div className=' overflow-y-auto'>
          {(isLoadingFromDisk) && (
            <ProcessIndicator />
          )}
          {/* {
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
          } */}
          <Editor
            value={fileInModal?.content || editedContent}
            language={fileInModal?.path.split('.').pop() || 'txt'}
            // onChange={(evn) => setEditedContent(evn.target.value)}
            disabled={true}
          />
        </div>
      </div>
    </div>
  );
};

export default ModalFileContent;