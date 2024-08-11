import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LOCAL_STORAGE_KEY_LAYOUT } from "../constants";
import { IProjectFile } from "../types";

export interface IView {
  name: "projects" | "file-tree" | "settings";
  visible: boolean;
}

export interface ILayoutState {
  showProjects: boolean;
  showProjectInfo: boolean;
  showProjectState: boolean;
  showProjectMessages: boolean;
  showProjectFiles: boolean;
  showFileTree: boolean;
  showSettings: boolean;
  showCodeEditor: boolean;
  showChat: boolean;
  fileInModal?: IProjectFile;
  views: IView[];
}

const defaultInitialState: ILayoutState = {
  showProjects: true,
  showProjectInfo: true,
  showProjectState: true,
  showProjectMessages: true,
  showProjectFiles: true,
  showFileTree: true,
  showSettings: false,
  showCodeEditor: false,
  showChat: true,
  fileInModal: undefined,
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
    setShowProjectFiles: (state, action: PayloadAction<boolean>) => {
      state.showProjectFiles = action.payload;
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
    setFileInModal: (
      state,
      action: PayloadAction<IProjectFile | undefined>
    ) => {
      state.fileInModal = action.payload;
    },
  },
});

export const {
  setShowProjects,
  setShowProjectInfo,
  setShowProjectState,
  setShowProjectMessages,
  setShowProjectFiles,
  setShowFolderTree,
  setShowSettings,
  setShowCodeEditor,
  setShowChat,
  setViews,
  setFileInModal,
} = layoutSlice.actions;

export default layoutSlice.reducer;
