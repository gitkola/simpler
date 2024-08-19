import { AppDispatch, RootState } from "..";
import { readFiles } from "../../services/fsService";
import { mergeProjectStates } from "../../services/projectStateService";
import { IMessage, IProjectState } from "../../types";
import { appendToInputValue } from "../chatSlice";
import {
  fetchCurrentProjectState,
  saveProjectState,
  setCurrentProjectStateError,
} from "../currentProjectSlice";

export const getProjectStateFiles =
  (paths: string[], message: IMessage) => async (dispatch: AppDispatch) => {
    const files = await readFiles(paths);
    const userMessage = `${
      (message as IMessage)?.context?.content
    }\nHere are the contents of some existing files from ProjectState for more context:\n\`\`\`json\n${JSON.stringify(
      { ProjectState: { files } },
      null,
      2
    )}\n\`\`\``;
    dispatch(appendToInputValue(userMessage));
  };

export const getProjectStateDescriptions =
  (message: IMessage) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const descriptions =
      getState().currentProject?.currentProjectState?.descriptions;
    const userMessage = `${
      (message as IMessage)?.context?.content
    }\nHere are the descriptions from ProjectState for more context:\n\`\`\`json\n${JSON.stringify(
      { ProjectState: { descriptions } },
      null,
      2
    )}\n\`\`\``;
    dispatch(appendToInputValue(userMessage));
  };

export const getProjectStateRequirements =
  (message: IMessage) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const requirements =
      getState().currentProject?.currentProjectState?.requirements;
    const userMessage = `${
      (message as IMessage)?.context?.content
    }\nHere are the requirements from ProjectState for more context:\n\`\`\`json\n${JSON.stringify(
      { ProjectState: { requirements } },
      null,
      2
    )}\n\`\`\``;
    dispatch(appendToInputValue(userMessage));
  };

export const getProjectStateTasks =
  (message: IMessage) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const tasks = getState().currentProject?.currentProjectState?.tasks;
    const userMessage = `${
      (message as IMessage)?.context?.content
    }\nHere are the tasks from ProjectState for more context:\n\`\`\`json\n${JSON.stringify(
      { ProjectState: { tasks } },
      null,
      2
    )}\n\`\`\``;
    dispatch(appendToInputValue(userMessage));
  };

export const updateProjectState =
  (projectStateUpdates: IProjectState) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const projectPath = getState().projects.activeProjectPath;
      if (!projectPath) return;
      dispatch(fetchCurrentProjectState());
      const projectState = getState().currentProject.currentProjectState;
      const mergedState = mergeProjectStates(
        projectState!,
        projectStateUpdates
      );
      await dispatch(saveProjectState(mergedState));
    } catch (error) {
      console.error("Error while syncing ProjectState:", error);
      dispatch(
        setCurrentProjectStateError(
          `Error while syncing ProjectState:: ${(error as Error).message}`
        )
      );
    }
  };
