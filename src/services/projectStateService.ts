import { invoke } from "@tauri-apps/api/tauri";
import {
  IMessage,
  ProjectPathListItem,
  IProjectState,
  IProjectSettings,
  IProjectFile,
  IProjectTask,
  IProjectRequirement,
  IProjectDescription,
} from "../types";
import {
  PROJECT_MESSAGES_FILE_NAME,
  PROJECT_OPENED_FILES_FILE_NAME,
  PROJECT_SETTINGS_FILE_NAME,
  PROJECT_STATE_FILE_NAME,
} from "../constants";
import { openaiModels } from "../configs/aiModels";
import store from "../store";
import { addProject } from "../store/projectsSlice";
import { IFile } from "../store/currentProjectSlice";

export const generateInitialProjectState = (): IProjectState => {
  return {
    descriptions: [],
    requirements: [],
    files: [],
    tasks: [],
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
    const result = await invoke("write_file", {
      path: projectStateFilePath,
      content: JSON.stringify(projectState, null, 2),
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
    const newProjectState = generateInitialProjectState();
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
    const result = await invoke("read_file", {
      path: messagesFilePath,
    });
    if (typeof result !== "string") {
      throw new Error("Invalid Project State file content");
    }
    const messages: IMessage[] = JSON.parse(result);
    return messages;
  } catch (error) {
    console.error("Error reading Project Messages file:", error);
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
    const result = await invoke("read_file", {
      path: openedFilesFilePath,
    });
    return JSON.parse(result as string);
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
    if (file.path && !file.content) {
      mergedFiles.delete(file.path);
    } else if (file.path && file.content) {
      mergedFiles.set(file.path, {
        ...file,
      });
    } else {
      //TODO: Handle case when file.path is undefined
    }
  });
  return Array.from(mergedFiles.values());
};

export const mergeTasks = (
  prevTasks: IProjectTask[],
  nextTasks: IProjectTask[]
) => {
  const mergedTasks = new Map<string, IProjectTask>();
  prevTasks.forEach((task) => {
    mergedTasks.set(task.id, task);
  });
  nextTasks.forEach((task) => {
    if (task.id && task.task) {
      mergedTasks.set(task.id, {
        ...task,
      });
    } else if (task.id && !task.task) {
      mergedTasks.delete(task.id);
    } else if (!task.id && task.task) {
      const now = Date.now();
      mergedTasks.set(`${now}}`, {
        ...task,
        id: `${now}`,
      });
    }
  });
  return Array.from(mergedTasks.values());
};

export const mergeRequirements = (
  prevRequirements: IProjectRequirement[],
  nextRequirements: IProjectRequirement[]
) => {
  const mergedRequirements = new Map<string, IProjectRequirement>();
  prevRequirements.forEach((requirement) => {
    mergedRequirements.set(requirement.id, requirement);
  });
  nextRequirements.forEach((requirement) => {
    if (requirement.id && !requirement.requirement) {
      mergedRequirements.delete(requirement.id);
    } else if (requirement.id && requirement.requirement) {
      mergedRequirements.set(requirement.id, {
        ...requirement,
      });
    } else if (!requirement.id && requirement.requirement) {
      const now = Date.now();
      mergedRequirements.set(`${now}`, {
        ...requirement,
        id: `${now}`,
      });
    }
  });
  return Array.from(mergedRequirements.values());
};

export const mergeDescriptions = (
  prevDescriptions: IProjectDescription[],
  nextDescriptions: IProjectDescription[]
) => {
  const mergedDescriptions = new Map<string, IProjectDescription>();
  prevDescriptions.forEach((description) => {
    mergedDescriptions.set(description.id, description);
  });
  nextDescriptions.forEach((description) => {
    if (description.id && !description.description) {
      mergedDescriptions.delete(description.id);
    } else if (description.id && description.description) {
      mergedDescriptions.set(description.id, {
        ...description,
      });
    } else if (!description.id && description.description) {
      const now = Date.now();
      mergedDescriptions.set(`${now}`, {
        ...description,
        id: `${now}`,
      });
    }
  });
  return Array.from(mergedDescriptions.values());
};
