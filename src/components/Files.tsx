import { useState } from 'react';
import { useAppDispatch, useAppSelector } from "../store";
import { handleSyncFilesFromFS, saveProjectState } from "../store/currentProjectSlice";
import { IProjectFile, IProjectState } from "../types";
import { writeFile } from "../utils/writeFile";
import { File } from './Icons';
import FileContentModal from './FileContentModal';

export const Files = () => {
  const dispatch = useAppDispatch();
  const currentProjectState = useAppSelector((state) => state?.currentProject?.currentProjectState);
  const files: IProjectFile[] | undefined = Array.isArray(currentProjectState?.files) ? [...currentProjectState?.files] : [];
  const [selectedFile, setSelectedFile] = useState<IProjectFile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileClick = async (file: IProjectFile) => {
    setIsLoading(true);
    setSelectedFile(file);
    // Simulate file content fetching delay
    await new Promise(resolve => setTimeout(resolve, 100));
    setIsLoading(false);
  };

  const closeModal = () => {
    setSelectedFile(null);
  };

  const getFileLanguage = (fileName: string) => {
    const extension = fileName?.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'js': return 'javascript';
      case 'ts': return 'typescript';
      case 'jsx': return 'jsx';
      case 'tsx': return 'tsx';
      case 'html': return 'html';
      case 'css': return 'css';
      case 'json': return 'json';
      default: return 'text';
    }
  };

  const handleSaveFile = async (content: string) => {
    if (selectedFile) {
      const updatedFile = { ...selectedFile, content };
      const updatedFiles = files?.map(f => f.path === updatedFile.path ? updatedFile : f) || [];
      if (currentProjectState) {
        const updatedProjectState: IProjectState = {
          ...currentProjectState,
          files: updatedFiles,
        };
        await dispatch(saveProjectState(updatedProjectState));
      }
      await writeFile(content, selectedFile.path);
    }
  };

  return (
    <div className="space-y-1 py-1">
      <div className="flex flex-col p-1 space-y-1 items-end justify-end">
        <button
          className="px-3 py-1 text-sm bg-yellow-600 text-white hover:bg-yellow-500 hover:shadow-md rounded-full justify-end"
          onClick={async () => await dispatch(handleSyncFilesFromFS())}
        >
          Sync Files from File System
        </button>
      </div>
      {Array.isArray(files) && files.length > 0 && (
        <div className="space-y-1">
          {files.map((file) => (
            <div
              key={file.path}
              className={`flex items-center px-2 py-1 border border-gray-300 border-opacity-30 hover:border-gray-300 hover:border-opacity-80 hover:shadow-md rounded-sm cursor-pointer ${!file?.content && 'opacity-50'}`}
              onClick={() => handleFileClick(file)}
            >
              {/* <File className="text-blue-500" /> */}
              {file?.path && <span className={`text-md`}>{file.path}</span>}
              {file?.content && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    writeFile(file.content, file.path);
                  }}
                  className="ml-auto px-3 text-sm bg-blue-500 hover:bg-blue-600 hover:shadow-md text-white rounded-full"
                >
                  Write to file
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      {selectedFile && (
        <FileContentModal
          isOpen={!!selectedFile}
          onClose={closeModal}
          path={selectedFile.path}
          content={selectedFile.content || ''}
          language={getFileLanguage(selectedFile.path)}
          isLoading={isLoading}
          onSave={handleSaveFile}
        />
      )}
    </div>
  );
};