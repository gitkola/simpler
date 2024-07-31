import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  IMessage,
  IProjectState,
  IProjectSettings,
  IMessageAction,
  MessageContent,
} from "../types";
import {
  loadProjectStateFromFile,
  loadProjectMessagesFromFile,
  loadProjectSettingsFromFile,
  saveProjectStateToFile,
  saveProjectMessagesToFile,
  saveProjectSettingsToFile,
  mergeProjectStates,
  readFilesFromFS,
  mergeFiles,
  loadProjectOpenedFilesFromFile,
  saveProjectOpenedFilesToFile,
} from "../utils/projectStateUtils";
import { AppDispatch, RootState } from "./index";
import { getAIResponseWithProjectState } from "../services/aiService";
import {
  getFilteredProjectFiles,
  getTreeData,
} from "../utils/getFilteredProjectFiles";
import { cloneDeep } from "lodash";
import { setShowCodeEditor } from "./layoutSlice";

export interface IFile {
  path: string;
  isActive?: boolean;
}

export interface ITreeData {
  name: string;
  path: string;
  checked: number;
  isOpen?: boolean;
  children?: ITreeData[];
  selected?: boolean;
}

export interface ICurrentProject {
  currentProjectState: IProjectState | null;
  isLoadingCurrentProjectState: boolean;
  currentProjectStateError?: string | null;

  currentProjectMessages: IMessage[];
  isLoadingCurrentProjectMessages: boolean;
  currentProjectMessagesError?: string | null;

  currentProjectSettings: IProjectSettings | null;
  isLoadingCurrentProjectSettings: boolean;
  currentProjectSettingsError?: string | null;

  currentProjectOpenedFiles: IFile[];
  isLoadingCurrentProjectOpenedFiles: boolean;
  currentProjectOpenedFilesError?: string | null;

  currentProjectFileTree: ITreeData | null;
  isLoadingCurrentProjectFileTree: boolean;
  currentProjectFileTreeError?: string | null;

  aiModelRequestInProgress: boolean;
  aiModelRequestError: string | null;
}

const defaultInitialState: ICurrentProject = {
  currentProjectState: null,
  isLoadingCurrentProjectState: false,
  currentProjectStateError: null,

  currentProjectMessages: [],
  isLoadingCurrentProjectMessages: false,
  currentProjectMessagesError: null,

  currentProjectSettings: null,
  isLoadingCurrentProjectSettings: false,
  currentProjectSettingsError: null,

  currentProjectOpenedFiles: [],
  isLoadingCurrentProjectOpenedFiles: false,
  currentProjectOpenedFilesError: null,

  currentProjectFileTree: null,
  isLoadingCurrentProjectFileTree: false,
  currentProjectFileTreeError: null,

  aiModelRequestInProgress: false,
  aiModelRequestError: null,
};

const currentProjectSlice = createSlice({
  name: "currentProject",
  initialState: defaultInitialState,
  reducers: {
    resetCurrentProject: () => {
      return defaultInitialState;
    },

    fetchCurrentProjectState: (state) => {
      state.isLoadingCurrentProjectState = true;
      state.currentProjectStateError = null;
    },
    setCurrentProjectState: (
      state,
      action: PayloadAction<IProjectState | null>
    ) => {
      state.currentProjectState = action.payload;
      state.isLoadingCurrentProjectState = false;
      state.currentProjectStateError = null;
    },
    setCurrentProjectStateError: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.isLoadingCurrentProjectState = false;
      state.currentProjectStateError = action.payload;
    },

    fetchCurrentProjectMessages: (state) => {
      state.isLoadingCurrentProjectMessages = true;
      state.currentProjectMessagesError = null;
    },
    setCurrentProjectMessages: (state, action: PayloadAction<IMessage[]>) => {
      state.currentProjectMessages = action.payload;
      state.isLoadingCurrentProjectMessages = false;
      state.currentProjectMessagesError = null;
    },
    setCurrentProjectMessagesError: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.isLoadingCurrentProjectMessages = false;
      state.currentProjectMessagesError = action.payload;
    },

    fetchCurrentProjectSettings: (state) => {
      state.isLoadingCurrentProjectSettings = true;
      state.currentProjectSettingsError = null;
    },
    setCurrentProjectSettings: (
      state,
      action: PayloadAction<IProjectSettings | null>
    ) => {
      state.currentProjectSettings = action.payload;
      state.isLoadingCurrentProjectSettings = false;
      state.currentProjectSettingsError = null;
    },
    setCurrentProjectSettingsError: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.isLoadingCurrentProjectSettings = false;
      state.currentProjectSettingsError = action.payload;
    },

    fetchCurrentProjectOpenedFiles: (state) => {
      state.isLoadingCurrentProjectOpenedFiles = true;
      state.currentProjectOpenedFilesError = null;
    },
    setCurrentProjectOpenedFiles: (state, action: PayloadAction<IFile[]>) => {
      state.currentProjectOpenedFiles = action.payload;
      state.isLoadingCurrentProjectOpenedFiles = false;
      state.currentProjectOpenedFilesError = null;
    },
    setCurrentProjectOpenedFilesError: (state, action: PayloadAction<any>) => {
      state.isLoadingCurrentProjectOpenedFiles = false;
      state.currentProjectOpenedFilesError = action.payload;
    },

    fetchCurrentProjectFileTree: (state) => {
      state.isLoadingCurrentProjectFileTree = true;
      state.currentProjectFileTreeError = null;
    },
    setCurrentProjectFileTree: (state, action: PayloadAction<any>) => {
      state.currentProjectFileTree = action.payload;
      state.isLoadingCurrentProjectFileTree = false;
      state.currentProjectFileTreeError = null;
    },
    setCurrentProjectFileTreeError: (state, action: PayloadAction<any>) => {
      state.isLoadingCurrentProjectFileTree = false;
      state.currentProjectFileTreeError = action.payload;
    },

    setAIModelRequestInProgress: (state, action: PayloadAction<boolean>) => {
      state.aiModelRequestInProgress = action.payload;
    },
    setAIModelRequestError: (state, action: PayloadAction<any>) => {
      state.aiModelRequestError = action.payload;
    },
  },
});

export const {
  resetCurrentProject,
  fetchCurrentProjectState,
  setCurrentProjectState,
  setCurrentProjectStateError,

  fetchCurrentProjectMessages,
  setCurrentProjectMessages,
  setCurrentProjectMessagesError,

  fetchCurrentProjectSettings,
  setCurrentProjectSettings,
  setCurrentProjectSettingsError,

  fetchCurrentProjectOpenedFiles,
  setCurrentProjectOpenedFiles,
  setCurrentProjectOpenedFilesError,

  fetchCurrentProjectFileTree,
  setCurrentProjectFileTree,
  setCurrentProjectFileTreeError,

  setAIModelRequestInProgress,
  setAIModelRequestError,
} = currentProjectSlice.actions;

export default currentProjectSlice.reducer;

export const loadProject =
  () => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const activeProjectPath = getState().projects.activeProjectPath;
      if (!activeProjectPath) return;
      await dispatch(loadProjectFileTree());
      await dispatch(loadProjectOpenedFiles());
      await dispatch(loadProjectState());
      await dispatch(loadProjectMessages());
      await dispatch(loadProjectSettings());
    } catch (error) {
      const errorMessage = `Failed to load project: ${
        (error as Error).message
      }`;
      console.log(errorMessage);
      dispatch(setCurrentProjectStateError(errorMessage));
    }
  };

export const loadProjectState =
  () => async (dispatch: AppDispatch, getState: () => RootState) => {
    const activeProjectPath = getState().projects.activeProjectPath;
    if (!activeProjectPath) return;
    try {
      let projectState = await loadProjectStateFromFile(activeProjectPath);
      dispatch(setCurrentProjectState(projectState));
    } catch (error) {
      console.error("Failed to load project state:", error);
      dispatch(setCurrentProjectStateError((error as Error).message));
    }
  };

export const loadProjectMessages =
  () => async (dispatch: AppDispatch, getState: () => RootState) => {
    const activeProjectPath = getState().projects.activeProjectPath;
    if (!activeProjectPath) return;
    try {
      let messages = await loadProjectMessagesFromFile(activeProjectPath);
      dispatch(setCurrentProjectMessages(messages));
    } catch (error) {
      console.error("Failed to load project messages:", error);
      dispatch(setCurrentProjectMessagesError((error as Error).message));
    }
  };

export const loadProjectSettings =
  () => async (dispatch: AppDispatch, getState: () => RootState) => {
    const activeProjectPath = getState().projects.activeProjectPath;
    if (!activeProjectPath) return;
    try {
      const settings = await loadProjectSettingsFromFile(activeProjectPath);
      dispatch(setCurrentProjectSettings(settings));
    } catch (error) {
      console.error("Failed to load project settings:", error);
      dispatch(setCurrentProjectSettingsError((error as Error).message));
    }
  };

export const loadProjectFileTree =
  () => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const activeProjectPath = getState().projects.activeProjectPath;
      if (!activeProjectPath) return;
      dispatch(fetchCurrentProjectFileTree());
      const filteredFilePaths = await getFilteredProjectFiles(
        activeProjectPath
      );
      const treeData = getTreeData(filteredFilePaths, activeProjectPath);
      dispatch(setCurrentProjectFileTree(treeData));
    } catch (error) {
      console.error("Failed to load project file tree: ", error);
      dispatch(setCurrentProjectStateError((error as Error).message));
    }
  };

export const loadProjectOpenedFiles =
  () => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const activeProjectPath = getState().projects.activeProjectPath;
      if (!activeProjectPath) return;
      dispatch(fetchCurrentProjectOpenedFiles());
      const openedFiles = await loadProjectOpenedFilesFromFile(
        activeProjectPath
      );
      dispatch(setCurrentProjectOpenedFiles(openedFiles));
    } catch (error) {
      console.error("Failed to load project opened files:", error);
      dispatch(setCurrentProjectOpenedFilesError((error as Error).message));
    }
  };

export const saveProjectState =
  (newProjectState: IProjectState) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const activeProjectPath = getState().projects.activeProjectPath;
      if (!activeProjectPath) return;
      dispatch(fetchCurrentProjectState());
      await saveProjectStateToFile(activeProjectPath, newProjectState);
      dispatch(setCurrentProjectState(newProjectState));
    } catch (error) {
      console.error("Failed to save project state:", error);
      dispatch(setCurrentProjectStateError((error as Error).message));
    }
  };

export const saveProjectMessages =
  (newProjectMessages: IMessage[]) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const activeProjectPath = getState().projects.activeProjectPath;
      if (!activeProjectPath) return;
      await saveProjectMessagesToFile(activeProjectPath, newProjectMessages);
      dispatch(setCurrentProjectMessages(newProjectMessages));
    } catch (error) {
      console.error("Failed to save project messages:", error);
      dispatch(setCurrentProjectMessagesError((error as Error).message));
    }
  };

export const saveProjectSettings =
  (newProjectSettings: IProjectSettings) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const activeProjectPath = getState().projects.activeProjectPath;
      if (!activeProjectPath) return;
      await saveProjectSettingsToFile(activeProjectPath, newProjectSettings);
      dispatch(setCurrentProjectSettings(newProjectSettings));
    } catch (error) {
      console.error("Failed to save project settings:", error);
      dispatch(setCurrentProjectSettingsError((error as Error).message));
    }
  };

export const handleClickOnFile =
  (path: string) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const openedFiles = getState().currentProject.currentProjectOpenedFiles;
      if (openedFiles.some((file) => file.path === path && file.isActive))
        return;
      let newOpenedFiles;
      if (!openedFiles.some((file) => file.path === path)) {
        newOpenedFiles = [...openedFiles, { path, isActive: true }];
      } else {
        newOpenedFiles = [...openedFiles];
      }
      dispatch(setShowCodeEditor(true));
      await dispatch(
        saveProjectOpenedFiles(
          newOpenedFiles.map((file) => ({
            path: file.path,
            isActive: file.path === path,
          }))
        )
      );
    } catch (error) {
      console.error("Failed to set current project opened file: ", error);
      dispatch(setCurrentProjectOpenedFilesError((error as Error).message));
    }
  };

export const handleClickOnFolder =
  (tree: ITreeData) => (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const currentProjectFileTree =
        getState().currentProject.currentProjectFileTree;
      if (!currentProjectFileTree) return;
      const toggleTreeFolder = (tree: ITreeData, path: string) => {
        if (Array.isArray(tree.children)) {
          if (tree.path === path) {
            tree.isOpen = !tree.isOpen;
            return;
          }
          for (const child of tree.children) {
            toggleTreeFolder(child, path);
          }
        }
      };
      const newFileTree = cloneDeep(currentProjectFileTree);
      toggleTreeFolder(newFileTree, tree.path);
      dispatch(setCurrentProjectFileTree(newFileTree));
    } catch (error) {
      console.error("Failed to handle toggle open folder: ", error);
      dispatch(setCurrentProjectFileTreeError((error as Error).message));
    }
  };

export const saveProjectOpenedFiles =
  (newProjectOpenedFiles: IFile[]) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const activeProjectPath = getState().projects.activeProjectPath;
      if (!activeProjectPath) return;
      dispatch(fetchCurrentProjectOpenedFiles());
      await saveProjectOpenedFilesToFile(
        activeProjectPath,
        newProjectOpenedFiles
      );
      dispatch(setCurrentProjectOpenedFiles(newProjectOpenedFiles));
    } catch (error) {
      console.error("Failed to save project opened files:", error);
      dispatch(setCurrentProjectOpenedFilesError((error as Error).message));
    }
  };

export const syncProjectStateWithAIUpdates =
  (projectStateUpdates: IProjectState) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const projectPath = getState().projects.activeProjectPath;
      if (!projectPath) return;
      dispatch(fetchCurrentProjectState());
      const projectState = getState().currentProject.currentProjectState;
      const mergedState = mergeProjectStates(
        projectState!,
        projectStateUpdates
      );
      dispatch(saveProjectState(mergedState));
    } catch (error) {
      console.error("Error while syncing Project State:", error);
      dispatch(
        setCurrentProjectStateError(
          `Error while syncing Project State:: ${(error as Error).message}`
        )
      );
    }
  };

export const requestAIModelWithProjectState =
  (prompt: string) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      dispatch(setAIModelRequestError(null));
      dispatch(setAIModelRequestInProgress(true));

      const projectSettings = getState().currentProject.currentProjectSettings;
      const projectState = getState().currentProject.currentProjectState;

      if (!projectState || !projectSettings) {
        dispatch(
          setAIModelRequestError("Project State or Settings are not loaded")
        );
        dispatch(setAIModelRequestInProgress(false));
        return;
      }
      const apiKeys = getState().settings.apiKeys;
      const { service, model, temperature, max_tokens } = projectSettings;
      const { aiResponse } = await getAIResponseWithProjectState(
        prompt,
        projectState,
        service,
        model,
        apiKeys[service],
        temperature,
        max_tokens
      );

      await dispatch(addMessageToThread(aiResponse, "assistant"));
    } catch (error) {
      const errorMessage = `Error in requestAIModelWithProjectState: ${
        (error as Error).message
      }`;
      console.error(errorMessage);
      dispatch(setAIModelRequestError(errorMessage));
    } finally {
      dispatch(setAIModelRequestInProgress(false));
    }
  };

export const addMessageToThread =
  (
    content: MessageContent | string,
    role: "app" | "user" | "assistant" | "system",
    action?: IMessageAction
  ) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const now = Date.now();
    const message: IMessage = {
      id: now,
      content,
      role,
      createdAt: now,
      updatedAt: now,
      action,
    };
    const messages = getState().currentProject.currentProjectMessages;
    await dispatch(saveProjectMessages([...messages, message]));
  };

export const handleNewMessageToAIModel =
  (
    content: string,
    role: "app" | "user" | "assistant" | "system",
    action?: IMessageAction
  ) =>
  async (dispatch: AppDispatch) => {
    await dispatch(addMessageToThread(content, role, action));
    await dispatch(requestAIModelWithProjectState(content));
  };

export const handleSyncFilesFromFS =
  () => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const currentProjectState = getState().currentProject.currentProjectState;
      const activeProjectPath = getState().projects.activeProjectPath;
      if (!activeProjectPath) {
        throw new Error("activeProjectPath is not defined");
      }
      dispatch(fetchCurrentProjectState());
      const files = (await readFilesFromFS(activeProjectPath)) || [];
      const mergedFiles = mergeFiles(
        currentProjectState!.files || [],
        files
      ).sort((a, b) => a.path.localeCompare(b.path));
      const updatedProjectState = {
        ...currentProjectState!,
        files: mergedFiles,
      };
      await dispatch(saveProjectState(updatedProjectState));
    } catch (error) {
      const errorMessage = `Error while syncing files from FS: ${
        (error as Error).message
      }`;
      console.error(errorMessage);
      dispatch(setCurrentProjectStateError(errorMessage));
    }
  };

export const updateFileContent =
  (fileId: number, newContent: string) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const state = getState();
      const currentProjectState = state.currentProject.currentProjectState;
      if (!currentProjectState) throw new Error("No active project state");
      dispatch(fetchCurrentProjectState());
      const updatedFiles = currentProjectState.files?.map((file) =>
        file.id === fileId
          ? { ...file, content: newContent, update: "modify" }
          : file
      );

      const updatedProjectState = {
        ...currentProjectState,
        files: updatedFiles,
      };

      await dispatch(saveProjectState(updatedProjectState as IProjectState));
    } catch (error) {
      const errorMessage = `Error updating file content:: ${
        (error as Error).message
      }`;
      console.error(errorMessage);
      dispatch(setCurrentProjectStateError(errorMessage));
    }
  };
