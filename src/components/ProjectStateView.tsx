import React from "react";
import { RootState, useAppSelector } from "../store";
import { ProjectState } from "./ProjectState";
import { Braces } from "./Icons";
import ProcessIndicator from "./ProcessIndicator";
import SquareButton from "./SquareButton";
import RenderCounter from "./RenderCounter";
import { useVisibility } from "react-visibility-persist";

const ProjectStateView: React.FC = () => {
  const { isLoadingCurrentProjectState, currentProjectStateError } =
    useAppSelector((state: RootState) => state?.currentProject);
  const { toggleVisibility: toggleProjectState } = useVisibility();
  return (
    <div className="flex flex-1 flex-col border-r border-0.5 min-w-[700px]">
      <RenderCounter name="Project State" />
      <div className="flex pl-2 space-x-2 items-center justify-between border-b border-0.5">
        <div className="flex items-center space-x-2">
          <Braces className="w-8 h-8" />
          <h2 className="text-lg font-semibold">Project State</h2>
        </div>
        <SquareButton
          icon="close"
          className=""
          onClick={() => {
            toggleProjectState("project-state");
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
        <ProjectState />
      </div>
    </div>
  );
};

export default ProjectStateView;
