import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LOCAL_STORAGE_KEY_LAYOUT } from "../constants";

export interface IView {
  name: "projects" | "file-tree" | "settings";
  visible: boolean;
}

export interface ILayoutState {
  showProjects: boolean;
  showProjectInfo: boolean;
  showProjectState: boolean;
  showProjectMessages: boolean;
  showFileTree: boolean;
  showSettings: boolean;
  showCodeEditor: boolean;
  showChat: boolean;
  views: IView[];
}

const defaultInitialState: ILayoutState = {
  showProjects: true,
  showProjectInfo: true,
  showProjectState: true,
  showProjectMessages: true,
  showFileTree: true,
  showSettings: false,
  showCodeEditor: false,
  showChat: true,
  views: [],
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
    setShowProjectInfo: (state, action: PayloadAction<boolean>) => {
      state.showProjectInfo = action.payload;
    },
    setShowProjectState: (state, action: PayloadAction<boolean>) => {
      state.showProjectState = action.payload;
    },
    setShowProjectMessages: (state, action: PayloadAction<boolean>) => {
      state.showProjectMessages = action.payload;
    },
    setShowFolderTree: (state, action: PayloadAction<boolean>) => {
      state.showFileTree = action.payload;
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
    setViews: (state, action: PayloadAction<IView[]>) => {
      state.views = action.payload;
    },
  },
});

export const {
  setShowProjects,
  setShowProjectInfo,
  setShowProjectState,
  setShowProjectMessages,
  setShowFolderTree,
  setShowSettings,
  setShowCodeEditor,
  setShowChat,
  setViews,
} = layoutSlice.actions;

export default layoutSlice.reducer;
