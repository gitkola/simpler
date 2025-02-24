import React from "react";
import { RootState, useAppDispatch, useAppSelector } from "../store";
import { Files } from "./Icons";
import ProcessIndicator from "./ProcessIndicator";
import { Files as FilesComponent } from "./Files";
import {
  handleSyncFilesFromFS,
  handleSyncFilesToFS,
} from "../store/currentProjectSlice";
import { outlineButtonBlue, outlineButtonOrange } from "../styles/styles";
import SquareButton from "./SquareButton";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { useVisibility } from "react-visibility-persist";

const ProjectFilesView: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    currentProjectState,
    isLoadingCurrentProjectState,
    currentProjectStateError,
  } = useAppSelector((state: RootState) => state?.currentProject);

  const { toggleVisibility: toggleProjectFiles } = useVisibility();

  return (
    <div className="flex flex-1 flex-col border-r border-0.5 min-w-[700px]">
      <div className="flex pl-2 space-x-2 items-center justify-between border-b border-0.5">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2">
            <Files className="w-8 h-8" />
            <h2 className="text-lg font-semibold">Project Files</h2>
            <span className="text-sm pl-2 text-gray-500">{`(${
              currentProjectState?.files?.length || 0
            })`}</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              className={`${outlineButtonOrange}`}
              onClick={async () => await dispatch(handleSyncFilesFromFS())}
            >
              <ArrowBigUp /> Sync From Disk
            </button>

            <button
              className={`${outlineButtonBlue}`}
              onClick={async () => await dispatch(handleSyncFilesToFS())}
            >
              <ArrowBigDown /> Sync From State
            </button>
            <SquareButton
              icon="close"
              onClick={() => toggleProjectFiles("project-files")}
            />
          </div>
        </div>
      </div>
      {isLoadingCurrentProjectState && <ProcessIndicator />}
      {currentProjectStateError && (
        <div className="mx-auto mt-2 px-2 py-1 rounded-md bg-red-400 text-red-700 z-100">
          {currentProjectStateError}
        </div>
      )}
      <div className="overflow-y-scroll overflow-x-hidden">
        <FilesComponent />
      </div>
    </div>
  );
};

export default ProjectFilesView;
