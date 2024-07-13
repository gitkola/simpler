import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProjectPathListItem } from "../types";
import { LOCAL_STORAGE_KEY_PROJECTS } from "../constants";

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
    setProjects: (state, action: PayloadAction<ProjectsState>) => {
      state = action.payload;
    },
    addProject: (state, action: PayloadAction<ProjectPathListItem>) => {
      state.list.push(action.payload);
    },
    deleteProject: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter((p) => p !== action.payload);
    },
    setActiveProject: (state, action: PayloadAction<string>) => {
      state.activeProjectPath = action.payload;
    },
  },
});

export const { setProjects, addProject, setActiveProject, deleteProject } =
  projectsSlice.actions;

export default projectsSlice.reducer;
