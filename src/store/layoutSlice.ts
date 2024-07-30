import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LOCAL_STORAGE_KEY_LAYOUT } from "../constants";

export interface IView {
  name: "projects" | "folder-tree" | "settings";
  visible: boolean;
}

export interface ILayoutState {
  // projectStateViewWidth: number;
  // activeSideMenuItem: string;
  showProjects: boolean;
  showFolderTree: boolean;
  showSettings: boolean;
  showCodeEditor: boolean;
  showChat: boolean;
  showProjectState: boolean;
}

const defaultInitialState: ILayoutState = {
  // projectStateViewWidth: 300,
  // activeSideMenuItem: "projects",

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
    // setProjectStateViewWidth: (state, action: PayloadAction<number>) => {
    //   state.projectStateViewWidth = action.payload;
    // },
    // setActiveSideMenuItem: (state, action: PayloadAction<string>) => {
    //   state.activeSideMenuItem = action.payload;
    // },
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
  // setProjectStateViewWidth,
  // setActiveSideMenuItem,
  setShowProjects,
  setShowFolderTree,
  setShowSettings,
  setShowCodeEditor,
  setShowChat,
  setShowProjectState,
} = layoutSlice.actions;

export default layoutSlice.reducer;
