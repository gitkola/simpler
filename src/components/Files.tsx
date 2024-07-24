import { useAppSelector } from "../store";
import { IProjectFile } from "../types";
import { File } from './Icons';

export const Files = () => {
  const files: IProjectFile[] | undefined = useAppSelector((state) => state?.currentProject?.currentProjectState?.files);
  return (
    <div className="space-y-1">
      {Array.isArray(files) && files.map(renderFile)}
    </div>
  );
}
const renderFile = (file: IProjectFile) => (
  <div
    key={file.path}
    className={`flex items-center p-1 bg-white border hover:border-gray-300 hover:shadow-md rounded-md cursor-pointer ${!file?.content && 'opacity-50'}`}
    onClick={() => console.log(file.path, 'file')}
  >
    <File className="mr-2 text-blue-500" />
    <span className={`text${getColorByStatus(file.status)}`}>{file?.path}</span>
    {file?.status && <span className={`bg${getColorByStatus(file.status)} px-2 py-1 rounded-md ml-auto`}>{file?.status || "none"}</span>}
    {file?.update && <span className={`px-2 py-1 text-sm`}>{file.update}</span>}
  </div>
);

const getColorByStatus = (status: string) => {
  switch (status) {
    case 'modified':
      return '-yellow-300';
    case 'created':
      return '-green-300';
    case 'deleted':
      return '-red-300';
    case 'planned':
      return '-gray-200';
    default:
      return '-gray-100';
  }
}