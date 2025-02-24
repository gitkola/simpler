import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IProjectState, IProjectSettings } from "../types";
import {
  loadProjectStateFromFile,
  loadProjectMessagesFromFile,
  loadProjectSettingsFromFile,
  saveProjectStateToFile,
  saveProjectMessagesToFile,
  saveProjectSettingsToFile,
  loadProjectOpenedFilesFromFile,
  saveProjectOpenedFilesToFile,
  saveCurrentProjectConversationToFile,
  loadCurrentProjectConversationFromFile,
} from "../services/projectStateService";
import { AppDispatch, RootState } from "./index";
import {
  getFilesFromDirectory,
  getFilteredProjectFiles,
  getTreeData,
} from "@/lib/utils/getFilteredProjectFiles";
import { cloneDeep } from "lodash";
// import { setShowCodeEditor } from "./layoutSlice";
import { IFileTreeState } from "../components/FileTree/fileTreeInterfaces";
import { readFilesFromFS, writeFile } from "../services/fsService";
import { IContextState } from "./contextSlice";
import { Message } from "ai";
import { getFileNameFromPath } from "@/lib/utils/pathUtils";

export interface IFile {
  path: string;
  isActive?: boolean;
}

export interface IProjectOpenedFile {
  path: string;
  isActive?: boolean;
}

export interface IProjectOpenedFiles {
  [path: string]: boolean;
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

  currentProjectMessages: Message[];
  isLoadingCurrentProjectMessages: boolean;
  currentProjectMessagesError?: string | null;

  currentProjectConversation: Message[];
  currentProjectConversationName: string | null;
  isLoadingCurrentProjectConversation: boolean;
  currentProjectConversationError?: string | null;

  currentProjectSettings: IProjectSettings | null;
  isLoadingCurrentProjectSettings: boolean;
  currentProjectSettingsError?: string | null;

  currentProjectOpenedFiles: IFile[];
  isLoadingCurrentProjectOpenedFiles: boolean;
  currentProjectOpenedFilesError?: string | null;

  currentProjectFileTree: ITreeData | null;
  fileTree: IFileTreeState | null;
  isLoadingCurrentProjectFileTree: boolean;
  currentProjectFileTreeError?: string | null;

  aiModelRequestInProgress: boolean;
  aiModelRequestError: string | null;

  currentProjectConversationsNames: string[];
  isLoadingCurrentProjectConversationsNames: boolean;
  currentProjectConversationsNamesError?: string | null;
}

const defaultInitialState: ICurrentProject = {
  currentProjectState: null,
  isLoadingCurrentProjectState: false,
  currentProjectStateError: null,

  currentProjectMessages: [],
  isLoadingCurrentProjectMessages: false,
  currentProjectMessagesError: null,

  currentProjectConversation: [],
  currentProjectConversationName: null,
  isLoadingCurrentProjectConversation: false,
  currentProjectConversationError: null,

  currentProjectSettings: null,
  isLoadingCurrentProjectSettings: false,
  currentProjectSettingsError: null,

  currentProjectOpenedFiles: [],
  isLoadingCurrentProjectOpenedFiles: false,
  currentProjectOpenedFilesError: null,

  currentProjectFileTree: null,
  fileTree: null,
  isLoadingCurrentProjectFileTree: false,
  currentProjectFileTreeError: null,

  aiModelRequestInProgress: false,
  aiModelRequestError: null,

  currentProjectConversationsNames: [],
  isLoadingCurrentProjectConversationsNames: false,
  currentProjectConversationsNamesError: null,
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
    setCurrentProjectMessages: (state, action: PayloadAction<Message[]>) => {
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

    fetchCurrentProjectConversation: (state) => {
      state.isLoadingCurrentProjectConversation = true;
      state.currentProjectConversationError = null;
    },
    setCurrentProjectConversation: (
      state,
      action: PayloadAction<Message[]>
    ) => {
      state.currentProjectConversation = action.payload;
      state.isLoadingCurrentProjectConversation = false;
      state.currentProjectConversationError = null;
    },
    setCurrentProjectConversationError: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.isLoadingCurrentProjectConversation = false;
      state.currentProjectConversationError = action.payload;
    },

    setCurrentProjectConversationName: (state, action) => {
      state.currentProjectConversationName = action.payload;
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
      state.currentProjectOpenedFiles = [];
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
    setFileTree: (state, action: PayloadAction<IFileTreeState | null>) => {
      state.fileTree = action.payload;
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

    fetchCurrentProjectConversationsNames: (state) => {
      state.isLoadingCurrentProjectConversationsNames = true;
      state.currentProjectConversationsNamesError = null;
    },
    setCurrentProjectConversationsNames: (
      state,
      action: PayloadAction<string[]>
    ) => {
      state.currentProjectConversationsNames = action.payload;
      state.isLoadingCurrentProjectConversationsNames = false;
      state.currentProjectConversationsNamesError = null;
    },
    setCurrentProjectConversationsNamesError: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.isLoadingCurrentProjectConversationsNames = false;
      state.currentProjectConversationsNamesError = action.payload;
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
  fetchCurrentProjectConversation,
  setCurrentProjectConversation,
  setCurrentProjectConversationError,
  setCurrentProjectConversationName,
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

  fetchCurrentProjectConversationsNames,
  setCurrentProjectConversationsNames,
  setCurrentProjectConversationsNamesError,
} = currentProjectSlice.actions;

export default currentProjectSlice.reducer;

export const loadProject =
  () => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const activeProjectPath = getState().projects.activeProjectPath;
      if (!activeProjectPath) return;
      const start = Date.now();
      await Promise.all([
        dispatch(loadProjectFileTree()),
        dispatch(loadProjectOpenedFiles()),
        dispatch(loadProjectState()),
        dispatch(loadProjectMessages()),
        dispatch(loadProjectSettings()),
        dispatch(loadCurrentProjectConversationsNames()),
      ]);
      console.log(`Project loaded in ${Date.now() - start}ms`);
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
    try {
      const activeProjectPath = getState().projects.activeProjectPath;
      if (!activeProjectPath) return;
      dispatch(fetchCurrentProjectState());
      let projectState = await loadProjectStateFromFile(activeProjectPath);
      dispatch(setCurrentProjectState(projectState));
    } catch (error) {
      console.error("Failed to load project state:", error);
      dispatch(setCurrentProjectStateError((error as Error).message));
    }
  };

export const loadProjectMessages =
  () => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const activeProjectPath = getState().projects.activeProjectPath;
      if (!activeProjectPath) return;
      dispatch(fetchCurrentProjectMessages());
      let messages = await loadProjectMessagesFromFile(activeProjectPath);
      dispatch(setCurrentProjectMessages(messages as Message[]));
    } catch (error) {
      console.error("Failed to load project messages:", error);
      dispatch(setCurrentProjectMessagesError((error as Error).message));
    }
  };

export const loadProjectSettings =
  () => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const activeProjectPath = getState().projects.activeProjectPath;
      if (!activeProjectPath) return;
      dispatch(fetchCurrentProjectSettings());
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
  (newProjectMessages: Message[]) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const activeProjectPath = getState().projects.activeProjectPath;
      if (!activeProjectPath) return;
      dispatch(fetchCurrentProjectMessages());
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
      dispatch(fetchCurrentProjectSettings());
      await saveProjectSettingsToFile(activeProjectPath, newProjectSettings);
      dispatch(setCurrentProjectSettings(newProjectSettings));
    } catch (error) {
      console.error("Failed to save project settings:", error);
      dispatch(setCurrentProjectSettingsError((error as Error).message));
    }
  };

export const handleOpenFileInEditor =
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
      // dispatch(setShowCodeEditor(true));
      await dispatch(
        saveProjectOpenedFiles(
          newOpenedFiles.map((file) => ({
            path: file.path,
            isActive: file.path === path,
          }))
        )
      );
    } catch (error) {
      const errorMessage = `Failed to handle click on file: ${
        (error as Error).message
          ? (error as Error).message
          : JSON.stringify(error, null, 2)
      }`;
      console.error(errorMessage, error);
      dispatch(setCurrentProjectOpenedFilesError(errorMessage));
    }
  };

export const handleClickOnFolder =
  (tree: ITreeData) => (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      dispatch(fetchCurrentProjectFileTree());
      const currentProjectFileTree =
        getState().currentProject.currentProjectFileTree;
      if (!currentProjectFileTree) throw new Error("No file tree found");
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

export const addMessageToThread =
  (message: Message) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const messages = getState().currentProject.currentProjectMessages;
    await dispatch(saveProjectMessages([...messages, message]));
  };

export const createSystemPrompt = (
  context: IContextState,
  generalInstructions: string,
  projectState: IProjectState | null
) => {
  const {
    projectDescriptionsInContext,
    projectRequirementsInContext,
    projectTasksInContext,
    projectFilePathsInContext,
    projectFilesInContext,
  } = context;
  console.log("projectFilesInContext", projectFilesInContext);
  const files = Object.keys(projectFilesInContext)
    .sort((a, b) => a.localeCompare(b))
    .map((path) => projectFilesInContext[path]);
  const filePaths =
    projectFilePathsInContext && Array.isArray(projectState?.files)
      ? projectState.files
          .map(({ path }) => {
            if (projectFilesInContext[path]) {
              return {
                path,
                content: projectFilesInContext[path].content!,
              };
            } else {
              return { path };
            }
          })
          ?.filter((file) => (file?.path ? true : false))
          ?.sort((a, b) => a.path!.localeCompare(b.path!))
      : [];
  const PartialProjectState: IProjectState = {
    descriptions: projectDescriptionsInContext
      ? projectState?.descriptions
      : [],
    requirements: projectRequirementsInContext
      ? projectState?.requirements
      : [],
    tasks: projectTasksInContext ? projectState?.tasks : [],
    files: filePaths.length > 0 ? filePaths : files.length > 0 ? files : [],
  };

  const PARTIAL_PROJECT_STATE = `## Current \`PartialProjectState\`:
\`\`\`json
${JSON.stringify({ PartialProjectState }, null, 2)}
\`\`\`

---`;

  const systemPrompt = `${
    context.instructionsInContext ? generalInstructions + "\n\n" : ""
  }${PARTIAL_PROJECT_STATE}`;

  return systemPrompt;
};

export const handleSyncFilesFromFS =
  () => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const { currentProjectState } = getState().currentProject;
      const activeProjectPath = getState().projects.activeProjectPath;
      if (!activeProjectPath) {
        throw new Error("activeProjectPath is not defined");
      }
      dispatch(fetchCurrentProjectState());
      let files = (await readFilesFromFS(activeProjectPath)) || [];
      files = files
        .map(({ path }) => ({ path }))
        .sort((a, b) => a.path.localeCompare(b.path));

      const updatedProjectState = {
        ...currentProjectState!,
        files: [...files],
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

export const handleSyncFilesToFS =
  () => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const { currentProjectState } = getState().currentProject;
      const activeProjectPath = getState().projects.activeProjectPath;
      if (!activeProjectPath) {
        throw new Error("activeProjectPath is not defined");
      }
      if (Array.isArray(currentProjectState?.files)) {
        for (const file of currentProjectState!.files) {
          await writeFile(file.content!, file.path);
        }
      }
    } catch (error) {
      const errorMessage = `Error while syncing files to FS: ${
        (error as Error).message
      }`;
      console.error(errorMessage);
      dispatch(setCurrentProjectStateError(errorMessage));
    }
  };

export const saveCurrentProjectConversation =
  (conversation: Message[]) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const activeProjectPath = getState().projects.activeProjectPath;
      if (!activeProjectPath) return;

      const currentDate = new Date();
      const formattedDate = currentDate
        .toISOString()
        .replace(/:/g, "-")
        .slice(0, 19);
      const fileName = `conversation-${formattedDate}.json`;
      dispatch(setCurrentProjectConversationName(fileName));
      await saveCurrentProjectConversationToFile(
        activeProjectPath,
        fileName,
        conversation
      );

      // Update the list of conversation names
      dispatch(loadCurrentProjectConversationsNames());
    } catch (error) {
      console.error("Failed to save current project conversation:", error);
      dispatch(setCurrentProjectConversationError((error as Error).message));
    }
  };

export const loadCurrentProjectConversation =
  (fileName: string) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const activeProjectPath = getState().projects.activeProjectPath;
      if (!activeProjectPath) return;
      dispatch(setCurrentProjectConversationName(fileName));
      dispatch(fetchCurrentProjectConversation());
      const conversation = await loadCurrentProjectConversationFromFile(
        activeProjectPath,
        fileName
      );
      dispatch(setCurrentProjectConversation(conversation));
    } catch (error) {
      console.error("Failed to load current project conversation:", error);
      dispatch(setCurrentProjectConversationError((error as Error).message));
    }
  };

export const loadCurrentProjectConversationsNames =
  () => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const activeProjectPath = getState().projects.activeProjectPath;
      if (!activeProjectPath) return;

      dispatch(fetchCurrentProjectConversationsNames());
      const conversationsNames = await getFilesFromDirectory(
        `${activeProjectPath}/.simpler/conversations`
      );
      dispatch(
        setCurrentProjectConversationsNames(
          conversationsNames.map((path) => getFileNameFromPath(path))
        )
      );
    } catch (error) {
      console.error(
        "Failed to load current project conversations names:",
        error
      );
      dispatch(
        setCurrentProjectConversationsNamesError((error as Error).message)
      );
    }
  };
