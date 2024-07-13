import { invoke } from "@tauri-apps/api/tauri";
import {
  Message,
  ProjectPathListItem,
  ProjectSettings,
  ProjectState,
  createTimestamps,
  updateTimestamp,
} from "../types";
import { PROJECT_STATE_FILE_NAME } from "../constants";
import { getFolderNameFromPath } from "./getFolderNameFromPath";
import { openaiModels } from "../configs/aiModels";
import store from "../store";
import { addProject } from "../store/projectsSlice";

export const generateInitialProjectState = (
  projectPath: string
): ProjectState => {
  const { createdAt, updatedAt } = createTimestamps();
  return {
    name: getFolderNameFromPath(projectPath),
    description: "",
    version: "0.0.1",
    requirements: [],
    files: [],
    ai_instructions: [],
    current_task: "",
    messages: [],
    settings: {
      service: "openai",
      model: openaiModels[0],
      temperature: 0,
      max_tokens: 4096,
    },
    createdAt,
    updatedAt,
    metadata: {},
  };
};

export const saveProjectState = async (
  projectPath: string,
  projectState: ProjectState
): Promise<void> => {
  const projectStateFilePath = `${projectPath}/${PROJECT_STATE_FILE_NAME}`;
  try {
    const updatedProjectState = updateTimestamp(projectState);
    const result = await invoke("write_file", {
      filePath: projectStateFilePath,
      content: JSON.stringify(updatedProjectState, null, 2),
    });
    if (result !== null) {
      throw new Error(result as string);
    }
  } catch (error) {
    console.error("Failed to save project state:", error);
    throw new Error("Failed to save project state");
  }
};

export const getProjectState = async (
  projectPath: string
): Promise<ProjectState | null> => {
  const projectStateFilePath = `${projectPath}/${PROJECT_STATE_FILE_NAME}`;
  try {
    const fileExists = await invoke("file_exists", {
      filePath: projectStateFilePath,
    });
    if (!fileExists) {
      // If the file doesn't exist, create a new empty project state
      const newProjectState = generateInitialProjectState(projectPath);
      await saveProjectState(projectPath, newProjectState);
      return newProjectState;
    }

    const result = await invoke("read_file", {
      filePath: projectStateFilePath,
    });
    if (typeof result !== "string") {
      throw new Error("Invalid project state file content");
    }
    const projectState: ProjectState = JSON.parse(result);
    return projectState;
  } catch (error) {
    console.error("Error reading project state file:", error);
    // If there's any error, return a new empty project state
    return null;
  }
};

export const addMessageToChat = async (
  projectPath: string,
  content: string,
  role: "user" | "assistant" | "system"
): Promise<void> => {
  let projectState = await getProjectState(projectPath);
  const newMessage: Message = {
    content,
    role,
    ...createTimestamps(),
  };
  if (
    typeof projectState === "object" &&
    projectState !== null &&
    Array.isArray(projectState.messages)
  ) {
    projectState.messages.push(newMessage);
    await saveProjectState(
      projectPath,
      updateTimestamp(projectState) as ProjectState
    );
  }
};

export const editProjectStateSettings = async (
  projectPath: string,
  settings: ProjectSettings
): Promise<void> => {
  const projectState = await getProjectState(projectPath);
  if (!projectState) {
    throw new Error("ProjectState not found");
  }
  projectState.settings = settings;
  await saveProjectState(
    projectPath,
    updateTimestamp(projectState) as ProjectState
  );
};

export const deleteMessage = async (
  projectPath: string,
  messageCreatedAt: number
): Promise<void> => {
  const projectState = await getProjectState(projectPath);
  if (!projectState) {
    throw new Error("ProjectState not found");
  }
  projectState.messages = projectState.messages?.filter(
    (m) => m.createdAt !== messageCreatedAt
  );
  await saveProjectState(
    projectPath,
    updateTimestamp(projectState) as ProjectState
  );
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
