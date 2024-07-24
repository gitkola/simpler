import { useAppSelector } from "../store";
import { IProjectFile } from "../types";
import { File } from './Icons';

export const Files = () => {
  const files: IProjectFile[] | undefined = useAppSelector((state) => state?.currentProject?.currentProjectState?.files);
  return (
    <>
      {Array.isArray(files) && files.length > 0 && (<div className="space-y-1 p-1">{files.map(renderFile)}</div>)}
    </>
  );
}
const renderFile = (file: IProjectFile) => (
  <div
    key={file.path}
    className={`flex items-center p-1 bg-white border hover:border-gray-300 hover:shadow-md rounded-md cursor-pointer ${!file?.content && 'opacity-50'}`}
    onClick={() => console.log(file.path, 'file')}
  >
    <File className="mr-2 text-blue-500" />
    {file?.update && <span className={`px-2 py-1 text-sm`}>{file.update}</span>}
  </div>
);
