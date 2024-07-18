import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IMessage, IProjectState } from "../types";
import {
  generateInitialProjectState,
  getProjectMessages,
  getProjectState,
  saveProjectMessages,
  saveProjectState,
} from "../utils/projectStateUtils";
import { AppDispatch } from "./index";

export interface ICurrentProject {
  currentProjectState: IProjectState | null;
  currentProjectMessages: IMessage[] | null;
}

const defaultInitialState: ICurrentProject = {
  currentProjectState: null,
  currentProjectMessages: null,
};

const currentProjectSlice = createSlice({
  name: "currentProject",
  initialState: defaultInitialState,
  reducers: {
    setCurrentProjectState: (
      state,
      action: PayloadAction<IProjectState | null>
    ) => {
      state.currentProjectState = action.payload;
    },
    setCurrentProjectMessages: (
      state,
      action: PayloadAction<IMessage[] | null>
    ) => {
      state.currentProjectMessages = action.payload;
    },
  },
});

export const { setCurrentProjectState, setCurrentProjectMessages } =
  currentProjectSlice.actions;

export default currentProjectSlice.reducer;

export const loadProjectStateFromFile =
  (activeProjectPath: string | null) => async (dispatch: AppDispatch) => {
    if (!activeProjectPath) return;
    try {
      let projectState = await getProjectState(activeProjectPath);
      if (!projectState) {
        projectState = generateInitialProjectState(activeProjectPath);
      }
      dispatch(setCurrentProjectState(projectState));
    } catch (error) {
      console.error("Failed to load project state:", error);
      dispatch(setCurrentProjectState(null));
    }
  };

export const loadProjectMessagesFromFile =
  (activeProjectPath: string | null) => async (dispatch: AppDispatch) => {
    if (!activeProjectPath) return;
    try {
      let messages = await getProjectMessages(activeProjectPath);
      dispatch(setCurrentProjectMessages(messages));
    } catch (error) {
      console.error("Failed to load project messages:", error);
      dispatch(setCurrentProjectMessages(null));
    }
  };

export const saveProjectStateToFile =
  (activeProjectPath: string | null, newProjectState: IProjectState) =>
  async (dispatch: AppDispatch) => {
    if (!activeProjectPath) return;
    try {
      await saveProjectState(activeProjectPath, newProjectState);
      dispatch(setCurrentProjectState(newProjectState));
    } catch (error) {
      console.error("Failed to save project state:", error);
      dispatch(setCurrentProjectState(newProjectState));
    }
  };

export const saveProjectMessagesToFile =
  (activeProjectPath: string | null, newProjectMessages: IMessage[]) =>
  async (dispatch: AppDispatch) => {
    if (!activeProjectPath) return;
    try {
      await saveProjectMessages(activeProjectPath, newProjectMessages);
      dispatch(setCurrentProjectMessages(newProjectMessages));
    } catch (error) {
      console.error("Failed to save project state:", error);
      dispatch(setCurrentProjectMessages(newProjectMessages));
    }
  };
