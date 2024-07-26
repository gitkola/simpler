import { useState } from 'react';
import { useAppDispatch, useAppSelector } from "../store";
import { handleSyncFilesFromFS } from "../store/currentProjectSlice";
import { IProjectFile } from "../types";
import { writeFile } from "../utils/writeFile";
import { File } from './Icons';
import FileContentModal from './FileContentModal';

export const Files = () => {
  const dispatch = useAppDispatch();
  const files: IProjectFile[] | undefined = useAppSelector((state) => state?.currentProject?.currentProjectState?.files);
  const [selectedFile, setSelectedFile] = useState<IProjectFile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileClick = async (file: IProjectFile) => {
    setIsLoading(true);
    setSelectedFile(file);
    // Simulate file content fetching delay
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsLoading(false);
  };

  const closeModal = () => {
    setSelectedFile(null);
  };

  const getFileLanguage = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
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

  return (
    <div className="space-y-1 p-1">
      <div className="flex flex-col p-1 space-y-1 items-end justify-end">
        <button
          className="px-3 py-1 text-sm bg-blue-500 text-white hover:bg-blue-600 hover:shadow-md rounded-full justify-end"
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
              className={`flex items-center p-1 bg-white border hover:border-gray-300 hover:shadow-md rounded-md cursor-pointer ${!file?.content && 'opacity-50'}`}
              onClick={() => handleFileClick(file)}
            >
              <File className="text-blue-500" />
              {file?.path && <span className={`px-2 text-sm`}>{file.path}</span>}
              {file?.content && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    writeFile(file.content, file.path);
                  }}
                  className="ml-auto px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 hover:shadow-md text-white rounded-full"
                >
                  Write
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
          fileName={selectedFile.path}
          content={selectedFile.content || ''}
          language={getFileLanguage(selectedFile.path)}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};