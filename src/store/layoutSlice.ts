import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LOCAL_STORAGE_KEY_LAYOUT } from "../constants";

export interface IView {
  name: "projects" | "folder-tree" | "settings";
  visible: boolean;
}

export interface ILayoutState {
  showProjects: boolean;
  showFolderTree: boolean;
  showSettings: boolean;
  showCodeEditor: boolean;
  showChat: boolean;
  showProjectState: boolean;
}

const defaultInitialState: ILayoutState = {
  showProjects: true,
  showFolderTree: true,
  showSettings: false,
  showCodeEditor: false,
  showChat: true,
  showProjectState: true,
};

const loadInitialState = (): ILayoutState => {
  const savedLayout = localStorage.getItem(LOCAL_STORAGE_KEY_LAYOUT);
  if (savedLayout) {
    return JSON.parse(savedLayout);
  }
  return defaultInitialState;
};

const layoutSlice = createSlice({
  name: "layout",
  initialState: loadInitialState(),
  reducers: {
    setShowProjects: (state, action: PayloadAction<boolean>) => {
      state.showProjects = action.payload;
    },
    setShowFolderTree: (state, action: PayloadAction<boolean>) => {
      state.showFolderTree = action.payload;
    },
    setShowSettings: (state, action: PayloadAction<boolean>) => {
      state.showSettings = action.payload;
    },
    setShowCodeEditor: (state, action: PayloadAction<boolean>) => {
      state.showCodeEditor = action.payload;
    },
    setShowChat: (state, action: PayloadAction<boolean>) => {
      state.showChat = action.payload;
    },
    setShowProjectState: (state, action: PayloadAction<boolean>) => {
      state.showProjectState = action.payload;
    },
  },
});

export const {
  setShowProjects,
  setShowFolderTree,
  setShowSettings,
  setShowCodeEditor,
  setShowChat,
  setShowProjectState,
} = layoutSlice.actions;

export default layoutSlice.reducer;
