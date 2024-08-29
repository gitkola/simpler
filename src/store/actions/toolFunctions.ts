import { AppDispatch, RootState } from "..";
import { readFile } from "../../services/fsService";
import { mergeProjectStates } from "../../services/projectStateService";
import { IMessage, IProjectState } from "../../types";
import { appendToInputValue } from "../chatSlice";
import {
  setProjectDescriptionsInContext,
  setProjectFilesInContext,
  setProjectRequirementsInContext,
  setProjectTasksInContext,
} from "../contextSlice";
import {
  fetchCurrentProjectState,
  saveProjectState,
  setCurrentProjectStateError,
} from "../currentProjectSlice";

export const getProjectStateFiles =
  (paths: string[], message: IMessage) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const activeProjectPath = getState().projects.activeProjectPath;
    const projectFilesInContext = getState().context.projectFilesInContext;
    const newFiles = { ...projectFilesInContext };

    for await (const path of paths) {
      const content = await readFile(`${activeProjectPath}/${path}`);
      newFiles[path] = { path, content };
    }

    dispatch(setProjectFilesInContext(newFiles));

    const userMessage = `${
      (message as IMessage)?.context?.content
    }\nProjectState.files contains content for files with paths: ${JSON.stringify(
      paths
    )}.`;
    dispatch(appendToInputValue(userMessage));
  };

export const getProjectStateFilesTool =
  ({ paths }: { paths: string[] }) =>
  async (_dispatch: AppDispatch, getState: () => RootState) => {
    const { activeProjectPath } = getState().projects;
    const newFiles = [];
    for await (const path of paths) {
      const content = await readFile(`${activeProjectPath}/${path}`);
      newFiles.push({ path, content });
    }
    return { files: newFiles };
  };

export const getProjectStateDescriptions =
  (message: IMessage) => async (dispatch: AppDispatch) => {
    dispatch(setProjectDescriptionsInContext(true));
    const userMessage = `${
      (message as IMessage)?.context?.content
    }\nProjectState contains 'descriptions' for more detailed information.`;
    dispatch(appendToInputValue(userMessage));
  };

export const getProjectStateDescriptionsTool =
  () => async (_dispatch: AppDispatch, getState: () => RootState) => {
    const descriptions =
      getState().currentProject.currentProjectState?.descriptions || [];
    return { descriptions };
  };

export const getProjectStateRequirements =
  (message: IMessage) => async (dispatch: AppDispatch) => {
    dispatch(setProjectRequirementsInContext(true));
    const userMessage = `${
      (message as IMessage)?.context?.content
    }\nProjectState contains 'requirements' for more detailed information.`;
    dispatch(appendToInputValue(userMessage));
  };

export const getProjectStateRequirementsTool =
  () => async (_dispatch: AppDispatch, getState: () => RootState) => {
    const requirements =
      getState().currentProject.currentProjectState?.requirements || [];
    return { requirements };
  };

export const getProjectStateTasks =
  (message: IMessage) => async (dispatch: AppDispatch) => {
    dispatch(setProjectTasksInContext(true));
    const userMessage = `${
      (message as IMessage)?.context?.content
    }\nProjectState contains 'tasks' for more detailed information.`;
    dispatch(appendToInputValue(userMessage));
  };

export const getProjectStateTasksTool =
  () => async (_dispatch: AppDispatch, getState: () => RootState) => {
    const tasks = getState().currentProject.currentProjectState?.tasks || [];
    return { tasks };
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
