import { useAppSelector } from "../store";
import { IProjectFile } from "../types";
import { FileComponent } from './FileComponent';

export const Files = () => {
  const { currentProjectState } = useAppSelector((state) => state?.currentProject);
  const files: IProjectFile[] | undefined = Array.isArray(currentProjectState?.files) ? [...currentProjectState?.files] : [];

  return (
    <div className="">
      {Array.isArray(files) && files.length > 0 && (
        <div className="">
          {files.map((file) => (
            <FileComponent
              key={file.path}
              file={file}
            />
          ))}
        </div>
      )}
    </div>
  );
};