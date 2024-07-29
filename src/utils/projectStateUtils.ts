import { invoke } from "@tauri-apps/api/tauri";
import {
  IMessage,
  ProjectPathListItem,
  IProjectState,
  createTimestamps,
  updateTimestamp,
  IProjectSettings,
  IProjectFile,
  IProjectTask,
  IProjectRequirement,
  IProjectDescription,
} from "../types";
import {
  MESSAGE_TO_AI_MODEL_GENERATE_PROJECT_TASKS_REQUEST,
  PROJECT_MESSAGES_FILE_NAME,
  PROJECT_OPENED_FILES_FILE_NAME,
  PROJECT_SETTINGS_FILE_NAME,
  PROJECT_STATE_FILE_NAME,
} from "../constants";
import { getFolderNameFromPath } from "./pathUtils";
import { openaiModels } from "../configs/aiModels";
import store from "../store";
import { addProject } from "../store/projectsSlice";
import {
  IFile,
  saveProjectMessages,
  setAIModelRequestError,
  setAIModelRequestInProgress,
} from "../store/currentProjectSlice";
import { getAIResponseWithProjectState } from "../services/aiService";
import { getFilteredProjectFiles } from "./getFilteredProjectFiles";

export const generateInitialProjectState = (
  projectPath: string
): IProjectState => {
  const { createdAt, updatedAt } = createTimestamps();
  return {
    name: getFolderNameFromPath(projectPath) || "",
    descriptions: [],
    requirements: [],
    files: [],
    tasks: [],
    createdAt,
    updatedAt,
  };
};

export const generateInitialProjectSettings = (): IProjectSettings => ({
  service: "openai",
  model: openaiModels[0],
  temperature: 0,
  max_tokens: 4096,
  indentation: "spaces",
  indentationSize: 2,
  lineEnding: "LF",
});

export const saveProjectStateToFile = async (
  projectPath: string,
  projectState: IProjectState
): Promise<void> => {
  const projectStateFilePath = `${projectPath}/${PROJECT_STATE_FILE_NAME}`;
  try {
    const updatedProjectState = updateTimestamp(projectState);
    const result = await invoke("write_file", {
      path: projectStateFilePath,
      content: JSON.stringify(updatedProjectState, null, 2),
    });
    if (result !== null) {
      throw new Error(result as string);
    }
  } catch (error) {
    console.error("Failed to save Project State:", error);
    throw new Error("Failed to save Project State");
  }
};

export const loadProjectStateFromFile = async (
  projectPath: string
): Promise<IProjectState | null> => {
  const projectStateFilePath = `${projectPath}/${PROJECT_STATE_FILE_NAME}`;
  try {
    const fileExists = await invoke("file_exists", {
      path: projectStateFilePath,
    });
    if (!fileExists) {
      // If the file doesn't exist, create a new empty Project State
      const newProjectState = generateInitialProjectState(projectPath);
      await saveProjectStateToFile(projectPath, newProjectState);
      return newProjectState;
    }

    const result = await invoke("read_file", {
      path: projectStateFilePath,
    });
    if (typeof result !== "string") {
      throw new Error("Invalid Project State file content");
    }
    const projectState: IProjectState = JSON.parse(result);
    return projectState;
  } catch (error) {
    console.error("Error reading Project State file:", error);
    // If there's any error, return a new empty Project State
    const newProjectState = generateInitialProjectState(projectPath);
    await saveProjectStateToFile(projectPath, newProjectState);
    return newProjectState;
  }
};

export const saveProjectMessagesToFile = async (
  projectPath: string,
  messages: IMessage[]
) => {
  const messagesFilePath = `${projectPath}/${PROJECT_MESSAGES_FILE_NAME}`;
  try {
    const result = await invoke("write_file", {
      path: messagesFilePath,
      content: JSON.stringify(messages || [], null, 2),
    });
    if (result !== null) {
      throw new Error(result as string);
    }
  } catch (error) {
    console.error("Failed to save Project Messages:", error);
    throw new Error("Failed to save Project Messages");
  }
};

export const loadProjectMessagesFromFile = async (
  projectPath: string
): Promise<IMessage[]> => {
  const messagesFilePath = `${projectPath}/${PROJECT_MESSAGES_FILE_NAME}`;
  try {
    const fileExists = await invoke("file_exists", {
      path: messagesFilePath,
    });
    if (!fileExists) {
      return [];
    }
    const result = await invoke("read_file", {
      path: messagesFilePath,
    });
    if (typeof result !== "string") {
      throw new Error("Invalid Project State file content");
    }
    const messages: IMessage[] = JSON.parse(result);
    return messages;
  } catch (error) {
    console.error("Error reading Project State file:", error);
    return [];
  }
};

export const saveProjectSettingsToFile = async (
  projectPath: string,
  projectSettings: IProjectSettings
) => {
  const settingsFilePath = `${projectPath}/${PROJECT_SETTINGS_FILE_NAME}`;
  try {
    const result = await invoke("write_file", {
      path: settingsFilePath,
      content: JSON.stringify(projectSettings || [], null, 2),
    });
    if (result !== null) {
      throw new Error(result as string);
    }
  } catch (error) {
    console.error("Failed to save Project Settings:", error);
    throw new Error("Failed to save Project Settings");
  }
};

export const saveProjectOpenedFilesToFile = async (
  projectPath: string,
  projectOpenedFiles: IFile[]
) => {
  const openedFilesFilePath = `${projectPath}/${PROJECT_OPENED_FILES_FILE_NAME}`;
  try {
    const result = await invoke("write_file", {
      path: openedFilesFilePath,
      content: JSON.stringify(projectOpenedFiles || [], null, 2),
    });
    if (result !== null) {
      throw new Error(result as string);
    }
  } catch (error) {
    console.error("Failed to save Project Opened Files:", error);
    throw new Error("Failed to save Project Opened Files");
  }
};

export const loadProjectSettingsFromFile = async (
  projectPath: string
): Promise<IProjectSettings | null> => {
  const settingsFilePath = `${projectPath}/${PROJECT_SETTINGS_FILE_NAME}`;
  try {
    const fileExists = await invoke("file_exists", {
      path: settingsFilePath,
    });
    if (!fileExists) {
      // If the file doesn't exist, create a new empty Project State
      const newProjectSettings = generateInitialProjectSettings();
      await saveProjectSettingsToFile(projectPath, newProjectSettings);
      return newProjectSettings;
    }
    const result = await invoke("read_file", {
      path: settingsFilePath,
    });
    if (typeof result !== "string") {
      throw new Error("Invalid Project Settings file content");
    }
    const settings: IProjectSettings = JSON.parse(result);
    return settings;
  } catch (error) {
    console.error("Error reading Project Settings file:", error);
    const newProjectSettings = generateInitialProjectSettings();
    await saveProjectSettingsToFile(projectPath, newProjectSettings);
    return newProjectSettings;
  }
};

export const loadProjectOpenedFilesFromFile = async (
  projectPath: string
): Promise<IFile[]> => {
  const openedFilesFilePath = `${projectPath}/${PROJECT_OPENED_FILES_FILE_NAME}`;
  try {
    const fileExists = await invoke("file_exists", {
      path: openedFilesFilePath,
    });
    if (!fileExists) {
      return [];
    }
    const result = await invoke("read_file", {
      path: openedFilesFilePath,
    });
    if (typeof result !== "string") {
      throw new Error("Invalid Project Opened Files file content");
    }
    const openedFiles: IFile[] = JSON.parse(result);
    return openedFiles;
  } catch (error) {
    console.error("Error reading Project Opened Files file:", error);
    return [];
  }
};

export const selectProjectStateFolder =
  async (): Promise<ProjectPathListItem | null> => {
    try {
      const projectPath = await invoke("select_folder");
      if (typeof projectPath !== "string" || !projectPath) return null;
      const existingProjectPath = store
        .getState()
        .projects.list.find((p) => p === projectPath);
      if (!existingProjectPath) {
        store.dispatch(addProject(projectPath));
      }
      return projectPath;
    } catch (error) {
      console.error("Failed to create project", error);
      return null;
    }
  };

export const mergeProjectStates = (
  prevState: IProjectState,
  nextState: IProjectState
) => {
  if (!nextState) return prevState;
  const mergedState = { ...prevState };

  mergedState.updatedAt = Date.now();
  mergedState.descriptions = mergeDescriptions(
    prevState.descriptions || [],
    nextState.descriptions || []
  );
  mergedState.requirements = mergeRequirements(
    prevState.requirements || [],
    nextState.requirements || []
  );
  mergedState.files = mergeFiles(prevState.files || [], nextState.files || []);
  mergedState.tasks = mergeTasks(prevState.tasks || [], nextState.tasks || []);

  return mergedState;
};

export const mergeFiles = (
  prevFiles: IProjectFile[],
  nextFiles: IProjectFile[]
) => {
  const mergedFiles = new Map<string, IProjectFile>();
  prevFiles.forEach((file) => {
    mergedFiles.set(file.path, file);
  });
  nextFiles.forEach((file) => {
    if (file.update === "delete") {
      mergedFiles.delete(file.path);
    } else if (["add", "modify"].includes(file.update as string)) {
      mergedFiles.set(file.path, {
        ...file,
        update: undefined,
      });
    } else {
      //TODO: Handle case when update is undefined
      mergedFiles.set(file.path, {
        ...file,
        update: undefined,
      });
    }
  });
  return Array.from(mergedFiles.values());
};

export const mergeTasks = (
  prevTasks: IProjectTask[],
  nextTasks: IProjectTask[]
) => {
  const mergedTasks = new Map<number, IProjectTask>();
  prevTasks.forEach((task) => {
    mergedTasks.set(task.id, task);
  });
  nextTasks.forEach((task) => {
    if (task.update === "delete") {
      mergedTasks.delete(task.id);
    } else if (["add", "modify"].includes(task.update as string)) {
      mergedTasks.set(task.id, {
        ...task,
        update: undefined,
      });
    } else {
      //TODO: Handle case when update is undefined
      mergedTasks.set(task.id, {
        ...task,
        update: undefined,
      });
    }
  });
  return Array.from(mergedTasks.values());
};

export const mergeRequirements = (
  prevRequirements: IProjectRequirement[],
  nextRequirements: IProjectRequirement[]
) => {
  const mergedRequirements = new Map<number, IProjectRequirement>();
  prevRequirements.forEach((requirement) => {
    mergedRequirements.set(requirement.id, requirement);
  });
  nextRequirements.forEach((requirement) => {
    if (requirement.update === "delete") {
      mergedRequirements.delete(requirement.id);
    } else if (["add", "modify"].includes(requirement.update as string)) {
      mergedRequirements.set(requirement.id, {
        ...requirement,
        update: undefined,
      });
    } else {
      //TODO: Handle case when update is undefined
      mergedRequirements.set(requirement.id, {
        ...requirement,
        update: undefined,
      });
    }
  });
  return Array.from(mergedRequirements.values());
};

export const mergeDescriptions = (
  prevDescriptions: IProjectDescription[],
  nextDescriptions: IProjectDescription[]
) => {
  const mergedDescriptions = new Map<number, IProjectDescription>();
  prevDescriptions.forEach((description) => {
    mergedDescriptions.set(description.id, description);
  });
  nextDescriptions.forEach((description) => {
    if (description.update === "delete") {
      mergedDescriptions.delete(description.id);
    } else if (["add", "modify"].includes(description.update as string)) {
      mergedDescriptions.set(description.id, {
        ...description,
        update: undefined,
      });
    } else {
      //TODO: Handle case when update is undefined
      mergedDescriptions.set(description.id, {
        ...description,
        update: undefined,
      });
    }
  });
  return Array.from(mergedDescriptions.values());
};

export const handleGenerateTasksAndFiles = async () => {
  store.dispatch(setAIModelRequestError(null));
  store.dispatch(setAIModelRequestInProgress(true));

  const projectSettings =
    store.getState().currentProject.currentProjectSettings;
  const projectState = store.getState().currentProject.currentProjectState;
  const apiKeys = store.getState().settings.apiKeys;
  const messages = store.getState().currentProject.currentProjectMessages;

  if (!projectState || !projectSettings) {
    store.dispatch(
      setAIModelRequestError("Project State or Settings are not loaded")
    );
    store.dispatch(setAIModelRequestInProgress(false));
    return;
  }

  try {
    const { service, model, temperature, max_tokens } = projectSettings;
    const { aiResponse } = await getAIResponseWithProjectState(
      MESSAGE_TO_AI_MODEL_GENERATE_PROJECT_TASKS_REQUEST,
      projectState,
      service,
      model,
      apiKeys[service],
      temperature,
      max_tokens
    );

    const now = Date.now();
    const assistantMessage: IMessage = {
      id: now,
      content: aiResponse,
      role: "assistant",
      createdAt: now,
      updatedAt: now,
    };

    const prevMessages = messages || [];
    store.dispatch(saveProjectMessages([...prevMessages, assistantMessage]));
  } catch (error) {
    console.error("Error while generating tasks and files:", error);
    store.dispatch(
      setAIModelRequestError(
        `An unknown error occurred while generating tasks and files: ${
          (error as Error).message
        }`
      )
    );
  } finally {
    store.dispatch(setAIModelRequestInProgress(false));
  }
};

export const readFilesFromFS = async (projectPath: string) => {
  try {
    if (typeof projectPath !== "string" || !projectPath) return null;
    const filteredFilePaths = await getFilteredProjectFiles(projectPath);
    const projectFiles: IProjectFile[] = [];
    for await (const filePath of filteredFilePaths) {
      try {
        const fileContent = await invoke<string>("read_file", {
          path: filePath,
        });
        const file: IProjectFile = {
          id: Date.now(),
          path: filePath.replace(`${projectPath}/`, ""),
          content: fileContent as string,
          update: "add",
        };
        projectFiles.push(file);
      } catch (fileError) {
        console.warn(
          `Skipping file ${filePath}: ${JSON.stringify(
            fileError as Error,
            null,
            2
          )}`
        );
        // Optionally, you can still add the file to projectFiles with empty content
        // projectFiles.push({ id: Date.now() + Math.random(), path: filePath, content: '' });
      }
    }
    return projectFiles;
  } catch (error) {
    const errorMessage = `Failed to read files from the selected folder: ${
      (error as Error).message
    }`;
    console.error(errorMessage, error);
    throw new Error(errorMessage);
  }
};
