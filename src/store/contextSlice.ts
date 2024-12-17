import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IProjectFile } from "../types";

export interface IContextState {
  useSystemMessage: boolean;
  instructionsInContext: boolean;
  projectDescriptionsInContext: boolean;
  projectRequirementsInContext: boolean;
  projectTasksInContext: boolean;
  projectFilePathsInContext: boolean;
  projectFilesInContext: { [path: string]: IProjectFile };
}

const defaultInitialState: IContextState = {
  useSystemMessage: true,
  instructionsInContext: true,
  projectDescriptionsInContext: true,
  projectRequirementsInContext: true,
  projectTasksInContext: true,
  projectFilePathsInContext: true,
  projectFilesInContext: {},
};

const contextSlice = createSlice({
  name: "context",
  initialState: defaultInitialState,
  reducers: {
    setUseSystemMessage: (state, action: PayloadAction<boolean>) => {
      state.useSystemMessage = action.payload;
    },
    setInstructionsInContext: (state, action: PayloadAction<boolean>) => {
      state.instructionsInContext = action.payload;
    },
    setProjectDescriptionsInContext: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.projectDescriptionsInContext = action.payload;
    },
    setProjectRequirementsInContext: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.projectRequirementsInContext = action.payload;
    },
    setProjectTasksInContext: (state, action: PayloadAction<boolean>) => {
      state.projectTasksInContext = action.payload;
    },
    setProjectFilePathsInContext: (state, action: PayloadAction<boolean>) => {
      state.projectFilePathsInContext = action.payload;
    },
    setProjectFilesInContext: (
      state,
      action: PayloadAction<{ [key: string]: IProjectFile }>
    ) => {
      state.projectFilesInContext = action.payload;
    },
  },
});

export const {
  setUseSystemMessage,
  setInstructionsInContext,
  setProjectDescriptionsInContext,
  setProjectRequirementsInContext,
  setProjectTasksInContext,
  setProjectFilePathsInContext,
  setProjectFilesInContext,
} = contextSlice.actions;

export default contextSlice.reducer;
