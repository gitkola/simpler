import React from "react";
import { RootState, useAppDispatch, useAppSelector } from "../store";
import { ProjectState } from "./ProjectState";
import { Braces } from "./Icons";
import ProcessIndicator from "./ProcessIndicator";
import SquareButton from "./SquareButton";
import { setShowProjectState } from "../store/layoutSlice";
import RenderCounter from "./RenderCounter";

const ProjectStateView: React.FC = () => {
  const { isLoadingCurrentProjectState, currentProjectStateError } =
    useAppSelector((state: RootState) => state?.currentProject);
  const dispatch = useAppDispatch();
  return (
    <div className="flex flex-col border-r border-0.5 min-w-[700px] max-w-[1200px]">
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
            dispatch(setShowProjectState(false));
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
