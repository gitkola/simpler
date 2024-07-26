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
} from "../utils/projectStateUtils";
import { AppDispatch, RootState } from "./index";
import { getAIResponseWithProjectState } from "../services/aiService";
import {
  MESSAGE_GENERATE_PROJECT_FILES_AND_TASKS_REQUEST,
  MESSAGE_TO_USER_PROJECT_DESCRIPTION_REQUEST,
  MESSAGE_TO_USER_PROJECT_REQUIREMENTS_REQUEST,
} from "../constants";

export interface ICurrentProject {
  currentProjectState: IProjectState | null;
  currentProjectMessages: IMessage[];
  currentProjectSettings: IProjectSettings | null;
  currentProjectStateError?: string | null;
  currentProjectMessagesError?: string | null;
  currentProjectSettingsError?: string | null;
  aiModelRequestInProgress: boolean;
  aiModelRequestError: string | null;
}

const defaultInitialState: ICurrentProject = {
  currentProjectState: null,
  currentProjectMessages: [],
  currentProjectSettings: null,
  currentProjectStateError: null,
  currentProjectMessagesError: null,
  currentProjectSettingsError: null,
  aiModelRequestInProgress: false,
  aiModelRequestError: null,
};

const currentProjectSlice = createSlice({
  name: "currentProject",
  initialState: defaultInitialState,
  reducers: {
    resetCurrentProject: (state) => {
      state = { ...state, ...defaultInitialState };
    },
    setCurrentProjectState: (
      state,
      action: PayloadAction<IProjectState | null>
    ) => {
      state.currentProjectState = action.payload;
    },
    setCurrentProjectStateError: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.currentProjectStateError = action.payload;
    },
    setCurrentProjectMessages: (state, action: PayloadAction<IMessage[]>) => {
      state.currentProjectMessages = action.payload;
    },
    setCurrentProjectMessagesError: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.currentProjectMessagesError = action.payload;
    },
    setCurrentProjectSettings: (
      state,
      action: PayloadAction<IProjectSettings | null>
    ) => {
      state.currentProjectSettings = action.payload;
    },
    setCurrentProjectSettingsError: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.currentProjectSettingsError = action.payload;
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
  setCurrentProjectState,
  setCurrentProjectMessages,
  setCurrentProjectSettings,
  setCurrentProjectStateError,
  setCurrentProjectMessagesError,
  setCurrentProjectSettingsError,
  setAIModelRequestInProgress,
  setAIModelRequestError,
} = currentProjectSlice.actions;

export default currentProjectSlice.reducer;

export const processProjectMessages =
  () => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const activeProjectPath = getState().projects.activeProjectPath;
      if (!activeProjectPath) return;
      const {
        currentProjectState: projectState,
        currentProjectMessages: messages,
      } = getState().currentProject;
      if (!projectState) {
        throw new Error("Project State is not loaded");
      }
      // const { description, requirements, files, tasks } = projectState;

      const lastMessage = messages[messages.length - 1];
      if (lastMessage?.role === "app") {
        // Expecting user action
        return;
      }

      if (lastMessage?.role === "user") {
        // await dispatch(processUserMessage(lastMessage));
        return;
      }
    } catch (error) {
      const errorMessage = `Error processing project messages: ${
        (error as Error).message
      }`;
      console.error(errorMessage);
      dispatch(setCurrentProjectStateError(errorMessage));
    }
  };

// export const processUserMessage =
//   (message: IMessage) =>
//   async (dispatch: AppDispatch, getState: () => RootState) => {
//     const {
//       currentProjectState: projectState,
//       currentProjectMessages: messages,
//     } = getState().currentProject;
//     const prevMessage = messages[messages.length - 2];
//     const { description, requirements, files, tasks } = projectState!;
//     if (
//       (!description || description === "") &&
//       prevMessage.content === MESSAGE_TO_USER_PROJECT_DESCRIPTION_REQUEST
//     ) {
//       await dispatch(processProjectDescription(message));
//       return;
//     } else if (!requirements || requirements?.length === 0) {
//       // await dispatch(processProjectRequirements(message));
//       return;
//     } else if (!tasks || tasks?.length === 0 || !files || files?.length === 0) {
//       await dispatch(handleGenerateTasksAndFiles());
//     } else {
//       // await sendMessageToAI(message.content as string);
//     }
//   };

export const processProjectDescription =
  (message: IMessage) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const projectState = getState().currentProject.currentProjectState;
      const updatedProjectState = {
        ...projectState,
        description: [
          { description: message.content as string, id: Date.now() },
        ],
      };
      await dispatch(saveProjectState(updatedProjectState as IProjectState));
    } catch (error) {
      const errorMessage = `Error processing project description: ${
        (error as Error).message
      }`;
      console.error(errorMessage);
      dispatch(setCurrentProjectStateError(errorMessage));
    }
  };

// export const processProjectRequirements =
//   (message: IMessage) =>
//   async (dispatch: AppDispatch, getState: () => RootState) => {
//     try {
//       const projectState = getState().currentProject.currentProjectState;
//       const requirementDescriptions = (message?.content as string)
//         ?.split("\n")
//         .filter((req) => req.trim() !== "");
//       const requirements: IProjectRequirement[] = requirementDescriptions.map(
//         (description, index) => ({
//           id: `REQ-${index + 1}`,
//           description,
//           status: "not_started",
//           priority: "medium",
//           createdAt: message.createdAt,
//           updatedAt: message.updatedAt,
//         })
//       );
//       const updatedProjectState = { ...projectState, requirements };
//       await dispatch(saveProjectState(updatedProjectState as IProjectState));
//     } catch (error) {
//       const errorMessage = `Error processing project requirements: ${
//         (error as Error).message
//       }`;
//       console.error(errorMessage);
//       dispatch(setCurrentProjectStateError(errorMessage));
//     }
//   };

export const handleRequestAIModelAPI =
  (prompt: string) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      dispatch(setAIModelRequestError(null));
      dispatch(setAIModelRequestInProgress(true));
      const projectState = getState().currentProject.currentProjectState;
      const currentProjectSettings =
        getState().currentProject.currentProjectSettings;
      const settings = getState().settings;
      if (!projectState || !currentProjectSettings) {
        throw new Error("Project State or Settings are not loaded");
      }
      const { service, model, temperature, max_tokens } =
        currentProjectSettings;
      const { aiResponse, updatedProjectState } =
        await getAIResponseWithProjectState(
          prompt,
          projectState,
          service,
          model,
          settings.apiKeys[service],
          temperature,
          max_tokens
        );

      const messages = getState().currentProject.currentProjectMessages;
      const prevMessages = messages || [];
      const now = Date.now();
      const assistantMessage: IMessage = {
        id: now,
        content: aiResponse,
        role: "assistant",
        createdAt: now,
        updatedAt: now,
      };

      const nextProjectState = mergeProjectStates(
        projectState,
        updatedProjectState
      );
      await dispatch(saveProjectState(nextProjectState));
      await dispatch(saveProjectMessages([...prevMessages, assistantMessage]));
    } catch (error) {
      const errorMessage = `Error while requesting AI Model API: ${
        (error as Error).message
      }`;
      console.error(errorMessage);
      dispatch(setAIModelRequestError(errorMessage));
    } finally {
      dispatch(setAIModelRequestInProgress(false));
    }
  };

export const processProjectState =
  () => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const activeProjectPath = getState().projects.activeProjectPath;
      if (!activeProjectPath) return;
      const {
        currentProjectState: projectState,
        currentProjectMessages: messages,
      } = getState().currentProject;
      if (!projectState) {
        throw new Error("Project State is not loaded");
      }
      const { descriptions, requirements, files, tasks } = projectState;

      const lastMessage = messages[messages.length - 1];

      if (descriptions === null || descriptions?.length === 0) {
        if (
          lastMessage?.content === MESSAGE_TO_USER_PROJECT_DESCRIPTION_REQUEST
        ) {
          // Expecting user to provide description
          return;
        } else {
          dispatch(
            addMessageToThread(
              MESSAGE_TO_USER_PROJECT_DESCRIPTION_REQUEST,
              "app"
            )
          );
        }
        return;
      }

      if (requirements?.length === 0) {
        if (
          lastMessage?.content !== MESSAGE_TO_USER_PROJECT_REQUIREMENTS_REQUEST
        ) {
          dispatch(
            addMessageToThread(
              MESSAGE_TO_USER_PROJECT_REQUIREMENTS_REQUEST,
              "app"
            )
          );
        }
        return;
      }

      if (files?.length === 0 || tasks?.length === 0) {
        dispatch(
          addMessageToThread(
            MESSAGE_GENERATE_PROJECT_FILES_AND_TASKS_REQUEST,
            "app",
            "generate_tasks_and_files"
          )
        );
        return;
      }
    } catch (error) {
      console.error("Error while processing Project State:", error);
      dispatch(
        setCurrentProjectStateError(
          `Error while processing Project State: ${(error as Error).message}`
        )
      );
    }
  };

export const loadProject =
  () => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const activeProjectPath = getState().projects.activeProjectPath;
      if (!activeProjectPath) return;
      await dispatch(loadProjectState());
      await dispatch(loadProjectMessages());
      await dispatch(loadProjectSettings());
      // await dispatch(processProjectState());
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

export const saveProjectState =
  (newProjectState: IProjectState) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const activeProjectPath = getState().projects.activeProjectPath;
      if (!activeProjectPath) return;
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

export const syncProjectStateWithAIUpdates =
  (projectStateUpdates: IProjectState) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const projectPath = getState().projects.activeProjectPath;
      if (!projectPath) return;
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
