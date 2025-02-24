import React from "react";
import { RootState, useAppDispatch, useAppSelector } from "../store";
import { Messages } from "./Icons";
import ProcessIndicator from "./ProcessIndicator";
import { ProjectMessages } from "./ProjectMessages";
import SquareButton from "./SquareButton";
// import { setShowProjectMessages } from '../store/layoutSlice';
import { useVisibility } from "react-visibility-persist";

const ProjectMessagesView: React.FC = () => {
  const { isLoadingCurrentProjectState, currentProjectStateError } =
    useAppSelector((state: RootState) => state?.currentProject);
  const { toggleVisibility: toggleProjectMessages } = useVisibility();
  return (
    <div className="flex flex-col border-r border-0.5 min-w-[700px] max-w-[1200px]">
      <div className="flex pl-2 items-center justify-between border-b border-0.5">
        <div className="flex space-x-2 items-center justify-start">
          <Messages className="w-8 h-8" />
          <h2 className="text-lg font-semibold">Messages</h2>
        </div>
        <SquareButton
          icon="close"
          className=""
          onClick={() => {
            toggleProjectMessages("project-messages");
          }}
        />
      </div>
      {isLoadingCurrentProjectState && <ProcessIndicator />}
      {currentProjectStateError && (
        <div className="mx-auto mt-2 px-2 py-1 rounded-md bg-red-400 text-red-700 z-100">
          {currentProjectStateError}
        </div>
      )}
      <div className="overflow-y-hidden overflow-x-hidden flex-1">
        <ProjectMessages />
      </div>
    </div>
  );
};

export default ProjectMessagesView;
