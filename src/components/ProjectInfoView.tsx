import React from "react";
import { RootState, useAppDispatch, useAppSelector } from "../store";
import Requirements from "./Requirements";
import Accordion from "./Accordion";
import Tasks from "./Tasks";
import Descriptions from "./Descriptions";
import { Info } from "./Icons";
import ProcessIndicator from "./ProcessIndicator";
import SquareButton from "./SquareButton";
import { setShowProjectInfo } from "../store/layoutSlice";
import RenderCounter from "./RenderCounter";

const ProjectInfoView: React.FC = () => {
  const {
    currentProjectState,
    isLoadingCurrentProjectState,
    currentProjectStateError,
  } = useAppSelector((state: RootState) => state?.currentProject);
  const dispatch = useAppDispatch();
  return (
    <div className="flex flex-col border-r border-0.5 min-w-[700px] max-w-[1200px]">
      <RenderCounter name="Project Info" />
      <div className="flex pl-2 space-x-2 items-center justify-between border-b border-0.5">
        <div className="flex items-center space-x-2">
          <Info className="w-8 h-8" />
          <h2 className="text-lg font-semibold">Project Info</h2>
        </div>
        <SquareButton
          icon="close"
          className=""
          onClick={() => {
            dispatch(setShowProjectInfo(false));
          }}
        />
      </div>
      {isLoadingCurrentProjectState && <ProcessIndicator />}
      {currentProjectStateError && (
        <div className="mx-auto mt-2 px-2 py-1 rounded-md bg-red-400 text-red-700 z-100">
          {currentProjectStateError}
        </div>
      )}
      <div className="pl-2 py-2 overflow-y-scroll overflow-x-hidden">
        <Accordion
          title={`Descriptions (${
            currentProjectState?.descriptions?.length || 0
          })`}
          content={<Descriptions />}
        />
        <Accordion
          title={`Requirements (${
            currentProjectState?.requirements?.length || 0
          })`}
          content={<Requirements />}
        />
        <Accordion
          title={`Tasks (${currentProjectState?.tasks?.length || 0})`}
          content={<Tasks />}
        />
      </div>
    </div>
  );
};

export default ProjectInfoView;
