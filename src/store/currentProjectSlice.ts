import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IMessage, IProjectState, IProjectSettings } from "../types";
import {
  loadProjectStateFromFile,
  loadProjectMessagesFromFile,
  loadProjectSettingsFromFile,
  saveProjectStateToFile,
  saveProjectMessagesToFile,
  saveProjectSettingsToFile,
  mergeProjectStates,
  loadProjectOpenedFilesFromFile,
  saveProjectOpenedFilesToFile,
} from "../services/projectStateService";
import { AppDispatch, RootState } from "./index";
import {
  getFilteredProjectFiles,
  getTreeData,
} from "../utils/getFilteredProjectFiles";
import { cloneDeep } from "lodash";
import { setShowCodeEditor } from "./layoutSlice";
import { IFileTreeState } from "../components/FileTree/fileTreeInterfaces";
// import { initializeFileTree } from "../components/FileTree/useFileTree";
// import { getFolderNameFromPath } from "../utils/pathUtils";
// import { initializeFlatFileTree } from "../components/FileTree/useFlatFileTree";
import {
  ANTHROPIC_API_URL,
  API_URL,
  callAIModelAPI,
  IRequestOptions,
  OPENAI_API_URL,
} from "../api/apiAIModels";
import { Body } from "@tauri-apps/api/http";
import { createTools } from "../utils/createTools";
import createBaseMessage from "../utils/createBaseMessage";
import { readFilesFromFS } from "../services/fsService";

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
  fileTree: IFileTreeState | null;
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
  fileTree: null,
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
      const start = Date.now();
      await Promise.all([
        dispatch(loadProjectFileTree()),
        dispatch(loadProjectOpenedFiles()),
        dispatch(loadProjectState()),
        dispatch(loadProjectMessages()),
        dispatch(loadProjectSettings()),
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
      dispatch(setCurrentProjectMessages(messages));
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
      // dispatch(
      //   initializeFileTree(
      //     filteredFilePaths.map(
      //       (path) =>
      //         `${getFolderNameFromPath(activeProjectPath)}/${path.replace(
      //           `${activeProjectPath}/`,
      //           ""
      //         )}`
      //     )
      //   )
      // );
      // dispatch(
      //   initializeFlatFileTree(
      //     filteredFilePaths.map(
      //       (path) =>
      //         `${getFolderNameFromPath(activeProjectPath)}/${path.replace(
      //           `${activeProjectPath}/`,
      //           ""
      //         )}`
      //     )
      //   )
      // );
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
      await dispatch(saveProjectState(mergedState));
    } catch (error) {
      console.error("Error while syncing Project State:", error);
      dispatch(
        setCurrentProjectStateError(
          `Error while syncing Project State:: ${(error as Error).message}`
        )
      );
    }
  };

export const addMessageToThread =
  (message: IMessage) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const messages = getState().currentProject.currentProjectMessages;
    await dispatch(saveProjectMessages([...messages, message]));
  };

export const handleSendMessage =
  (message: IMessage) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      dispatch(setAIModelRequestError(null));
      dispatch(setAIModelRequestInProgress(true));

      const projectSettings = getState().currentProject.currentProjectSettings;
      const projectState = getState().currentProject.currentProjectState;
      const {
        instructionsInContext,
        projectDescriptionInContext,
        projectRequirementsInContext,
        projectTasksInContext,
        projectFilePathsInContext,
        projectFilesInContext,
      } = getState().context;
      const { generalInstructions } = getState().settings.instructions;

      if (!projectState || !projectSettings) {
        dispatch(
          setAIModelRequestError("Project State or Settings are not loaded")
        );
        dispatch(setAIModelRequestInProgress(false));
        return;
      }
      const apiKeys = getState().settings.apiKeys;
      const { service, model, temperature, max_tokens } = projectSettings;

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

      const lightProjectState = {
        ...projectState,
        descriptions: projectDescriptionInContext
          ? projectState?.descriptions
          : undefined,
        requirements: projectRequirementsInContext
          ? projectState?.requirements
          : undefined,
        tasks: projectTasksInContext ? projectState?.tasks : undefined,
        files:
          filePaths.length > 0
            ? filePaths
            : files.length > 0
            ? files
            : undefined,
      };
      const CURRENT_PROJECT_STATE = `#Current Project State
The project state has been simplified to show for some files only the paths without content to avoid reaching tokens limit.
\`\`\`
${JSON.stringify(lightProjectState, null, 2)}
\`\`\`
If the file you need doesn't have 'content' you must request only the necessary files for the current task by calling \`readFiles\` function with the array of relative file paths.
`;
      // const systemPrompt = `${AI_INSTRUCTIONS_RESPONSIBILITIES}\n\n${AI_INSTRUCTIONS_PROJECT_STATE}\n\n${CURRENT_PROJECT_STATE}\n`; //\n${AI_INSTRUCTIONS_RESPONSE_GUIDELINES}`,
      const systemPrompt = `${
        instructionsInContext ? `${generalInstructions}\n\n` : ""
      }${
        Object.keys(lightProjectState).length > 0
          ? `${CURRENT_PROJECT_STATE}`
          : ""
      }`;
      let url: API_URL;
      let options: IRequestOptions;
      if (service === "openai") {
        url = OPENAI_API_URL;
        const body = Body.json({
          model,
          tool_choice: "auto",
          max_tokens: 4095,
          temperature,
          frequency_penalty: 0,
          presence_penalty: 0,
          messages: [
            systemPrompt && {
              role: "system",
              content: systemPrompt,
            },
            { role: "user", content: message?.content },
          ],
          tools: createTools(service),
        });

        options = {
          method: "POST",
          timeout: 120,
          headers: {
            Authorization: `Bearer ${apiKeys[service]}`,
            "Content-Type": "application/json",
          },
          body,
        };
      } else if (service === "anthropic") {
        url = ANTHROPIC_API_URL;

        const body = Body.json({
          model,
          system: systemPrompt,
          messages: [{ role: "user", content: message?.content }],
          tools: createTools(service),
          max_tokens,
          temperature,
        });

        options = {
          method: "POST",
          timeout: 120,
          headers: {
            "x-api-key": apiKeys[service],
            "Content-Type": "application/json",
            "anthropic-version": "2023-06-01",
          },
          body,
        };
      } else {
        throw new Error("Invalid AI service selected");
      }
      const systemMessage = createBaseMessage(systemPrompt, "system");
      await dispatch(addMessageToThread(systemMessage));

      await dispatch(addMessageToThread(message));
      const response = await callAIModelAPI(url, options);
      const now = Date.now();
      await dispatch(
        addMessageToThread({
          ...response,
          context: message,
          service,
          createdAt: now,
          updatedAt: now,
        })
      );
    } catch (error) {
      const errorMessage = `Error in handleSendMessage: ${
        typeof error === "string" ? error : (error as Error).message
      }`;
      console.error(error);
      dispatch(setAIModelRequestError(errorMessage));
    } finally {
      dispatch(setAIModelRequestInProgress(false));
    }
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
      let files = (await readFilesFromFS(activeProjectPath)) || [];
      files = files
        .map((file) => ({ path: file.path }))
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
