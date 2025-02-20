import { useAppDispatch, useAppSelector } from "@/store";
import { handleOpenFileInEditor, saveProjectState } from "@/store/currentProjectSlice";
import { IProjectFile, IProjectState } from "@/types";
import { getFullFilePath, readFiles, writeFile } from "@/services/fsService";
import AppIcon from "./Icons";

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
    // const updatedFile = { path: file.path };
    // const updatedFiles = files?.map(f => f.path === updatedFile.path ? updatedFile : f) || [];
    // if (currentProjectState) {
    //   const updatedProjectState: IProjectState = {
    //     ...currentProjectState,
    //     files: updatedFiles,
    //   };
    //   await dispatch(saveProjectState(updatedProjectState));
    // }
  };
  return (
    <div
      key={file.path}
      className={`flex items-center justify-between hover:bg-gray-500 hover:bg-opacity-20 cursor-pointer`}
      onClick={async () => await handleFileClick(file)}
    >
      {file?.path && <span className={`${!file?.content && 'opacity-50'} pl-2`}>{file.path}</span>}
      <div className="flex px-2">
        <button
          aria-label="Read from file"
          onClick={async (e) => {
            e.stopPropagation();
            await handleReadFromFile({ content: file.content!, path: file.path });
          }}
          className="ml-auto px-2 py-1 text-sm hover:bg-orange-500 hover:bg-opacity-20 text-orange-500 rounded-sm"
        >
          <AppIcon icon="file-input" size={24} />
        </button>
        <button
          onClick={async (e) => {
            e.stopPropagation();
            await handleWriteToFile({ content: file.content!, path: file.path });
          }}
          className={`ml-auto px-2 py-1 text-sm  hover:bg-blue-500 hover:bg-opacity-20 text-blue-500 rounded-sm ${!file?.content && 'opacity-50'}`}
          disabled={!file?.content}
        >
          <AppIcon icon="file-output" size={24} />
        </button>
      </div>
    </div>
  );
}