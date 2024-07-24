import { useAppDispatch, useAppSelector } from "../store";
import { handleSyncFilesFromFS } from "../store/currentProjectSlice";
import { IProjectFile } from "../types";
import { writeFile } from "../utils/writeFile";
import { File } from './Icons';

export const Files = () => {
  const dispatch = useAppDispatch();
  const files: IProjectFile[] | undefined = useAppSelector((state) => state?.currentProject?.currentProjectState?.files);
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
      {Array.isArray(files) && files.length > 0 && (<div className="space-y-1">{files.map(renderFile)}</div>)}
    </div>
  );
}
const renderFile = (file: IProjectFile) => (
  <div
    key={file.path}
    className={`flex items-center p-1 bg-white border hover:border-gray-300 hover:shadow-md rounded-md cursor-pointer ${!file?.content && 'opacity-50'}`}
    onClick={() => console.log(file.path, 'file')}
  >
    <File className="text-blue-500" />
    {file?.path && <span className={`px-2 text-sm`}>{file.path}</span>}
    {file?.content && (
      <button
        onClick={async () => await writeFile(file.content, file.path)}
        className="ml-auto px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 hover:shadow-md text-white rounded-full">
        Write
      </button>
    )}
  </div>
);
