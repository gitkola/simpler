import { useAppDispatch, useAppSelector } from "../store";
import { handleOpenFileInEditor, saveProjectState } from "../store/currentProjectSlice";
import { IProjectFile, IProjectState } from "../types";
import { getFullFilePath, readFiles, writeFile } from "../services/fsService";

export function FileComponent({ file }: { file: IProjectFile }) {
  const dispatch = useAppDispatch();
  const currentProjectState = useAppSelector((state) => state?.currentProject?.currentProjectState);
  const files: IProjectFile[] | undefined = Array.isArray(currentProjectState?.files) ? [...currentProjectState?.files] : [];

  const handleFileClick = async (file: IProjectFile) => {
    const fullPath = await getFullFilePath(file.path);
    await dispatch(handleOpenFileInEditor(fullPath));
  };

  const handleReadFromFile = async (file: IProjectFile) => {
    const selectedFiles = await readFiles([file.path]);
    const selectedFile = selectedFiles[0];
    const newProjectState = {
      ...currentProjectState,
      files: files.map(f => f.path === selectedFile.path ? selectedFile : f),
    };
    await dispatch(saveProjectState(newProjectState));
  };

  const handleWriteToFile = async (file: IProjectFile) => {
    await writeFile(file.content!, file.path);
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
    <div
      key={file.path}
      className={`flex items-center justify-between py-1 border border-transparent hover:border-b cursor-pointer`}
      onClick={async () => await handleFileClick(file)}
    >
      {file?.path && <span className={`${!file?.content && 'opacity-50'}`}>{file.path}</span>}
      <div className="flex space-x-2 px-2">
        <button
          onClick={async (e) => {
            e.stopPropagation();
            await handleReadFromFile({ content: file.content!, path: file.path });
          }}
          className="ml-auto px-2 text-sm bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full"
        >
          Read
        </button>
        <button
          onClick={async (e) => {
            e.stopPropagation();
            await handleWriteToFile({ content: file.content!, path: file.path });
          }}
          className={`ml-auto px-2 text-sm bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full ${!file?.content && 'opacity-50'}`}
          disabled={!file?.content}
        >
          Write
        </button>
      </div>
    </div>
  );
}