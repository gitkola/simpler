import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProjectPathListItem } from "../types";
import { LOCAL_STORAGE_KEY_PROJECTS } from "../constants";
import {
  resetCurrentProject,
  // setCurrentProjectMessages,
  // setCurrentProjectSettings,
  // setCurrentProjectState,
} from "./currentProjectSlice";
import { AppDispatch, RootState } from "../store";

export interface ProjectsState {
  list: ProjectPathListItem[];
  activeProjectPath: string | null;
}

const defaultInitialState: ProjectsState = {
  list: [],
  activeProjectPath: null,
};

const loadInitialState = (): ProjectsState => {
  const savedProjects = localStorage.getItem(LOCAL_STORAGE_KEY_PROJECTS);
  if (savedProjects) {
    return JSON.parse(savedProjects);
  }
  return defaultInitialState;
};

const projectsSlice = createSlice({
  name: "projects",
  initialState: loadInitialState(),
  reducers: {
    // setProjects: (state, action: PayloadAction<ProjectsState>) => {
    //   state = action.payload;
    // },
    addProject: (state, action: PayloadAction<ProjectPathListItem>) => {
      state.list.push(action.payload);
    },
    deleteProject: (state, action: PayloadAction<string>) => {
      if (state.activeProjectPath === action.payload) {
        state.activeProjectPath = null;
      }
      state.list = state.list.filter((p) => p !== action.payload);
    },
    setActiveProject: (state, action: PayloadAction<string>) => {
      state.activeProjectPath = action.payload;
    },
  },
});

export const { addProject, setActiveProject, deleteProject } =
  projectsSlice.actions;

export default projectsSlice.reducer;

export const handleSetActiveProject =
  (projectPath: string | null) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    if (!projectPath) return;
    const activeProjectPath = getState().projects?.activeProjectPath;
    if (activeProjectPath === projectPath) return;
    // dispatch(setCurrentProjectMessages([]));
    // dispatch(setCurrentProjectState(null));
    // dispatch(setCurrentProjectSettings(null));
    dispatch(resetCurrentProject());
    dispatch(setActiveProject(projectPath));
  };
