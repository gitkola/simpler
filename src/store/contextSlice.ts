import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IProjectFile } from "../types";

export interface IContextState {
  instructionsInContext: boolean;
  projectDescriptionInContext: boolean;
  projectRequirementsInContext: boolean;
  projectTasksInContext: boolean;
  projectFilePathsInContext: boolean;
  projectFilesInContext: { [key: string]: IProjectFile };
}

const defaultInitialState: IContextState = {
  instructionsInContext: true,
  projectDescriptionInContext: true,
  projectRequirementsInContext: true,
  projectTasksInContext: true,
  projectFilePathsInContext: true,
  projectFilesInContext: {},
};

const contextSlice = createSlice({
  name: "context",
  initialState: defaultInitialState,
  reducers: {
    setInstructionsInContext: (state, action: PayloadAction<boolean>) => {
      state.instructionsInContext = action.payload;
    },
    setProjectDescriptionInContext: (state, action: PayloadAction<boolean>) => {
      state.projectDescriptionInContext = action.payload;
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
  setInstructionsInContext,
  setProjectDescriptionInContext,
  setProjectRequirementsInContext,
  setProjectTasksInContext,
  setProjectFilePathsInContext,
  setProjectFilesInContext,
} = contextSlice.actions;

export default contextSlice.reducer;
