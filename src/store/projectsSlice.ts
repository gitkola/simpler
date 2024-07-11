import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProjectListItem } from "../types";
import { LOCAL_STORAGE_KEY_PROJECTS } from "../constants";

export interface ProjectsState {
  list: ProjectListItem[];
  activeProjectId: number | null;
}

const defaultInitialState: ProjectsState = {
  list: [],
  activeProjectId: null,
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
    addProject: (state, action: PayloadAction<ProjectListItem>) => {
      state.list.push(action.payload);
    },
    updateProject: (state, action: PayloadAction<ProjectListItem>) => {
      const index = state.list.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    deleteProject: (state, action: PayloadAction<number>) => {
      state.list = state.list.filter((p) => p.id !== action.payload);
    },
    setActiveProject: (state, action: PayloadAction<number>) => {
      state.activeProjectId = action.payload;
    },
  },
});

export const {
  setProjects,
  addProject,
  updateProject,
  setActiveProject,
  deleteProject,
} = projectsSlice.actions;

export default projectsSlice.reducer;
