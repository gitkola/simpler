import { useState } from 'react';
import { useAppDispatch, useAppSelector } from "../store";
import { saveProjectState } from "../store/currentProjectSlice";
import { IProjectFile, IProjectState } from "../types";
import { writeFile } from "../services/fsService";
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

  const handleSaveFile = async (file: { content: string; path: string }) => {
    await writeFile(file.content, file.path);
    const updatedFile = { path: file.path };
    const updatedFiles = files?.map(f => f.path === updatedFile.path ? updatedFile : f) || [];
    if (currentProjectState) {
      const updatedProjectState: IProjectState = {
        ...currentProjectState,
        files: updatedFiles,
      };
      await dispatch(saveProjectState(updatedProjectState));
    }
  };

  return (
    <div className="pl-2">
      {Array.isArray(files) && files.length > 0 && (
        <div className="">
          {files.map((file) => (
            <div
              key={file.path}
              className={`flex items-center py-1 border border-transparent hover:border-b cursor-pointer ${!file?.content && 'opacity-50'}`}
              onClick={() => handleFileClick(file)}
            >
              {file?.path && <span className={``}>{file.path}</span>}
              {file?.content && (
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    await handleSaveFile({ content: file.content!, path: file.path });
                  }}
                  className="ml-auto px-3 text-sm bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full"
                >
                  Write to File
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