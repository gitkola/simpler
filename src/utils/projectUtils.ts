import { invoke } from "@tauri-apps/api/tauri";
import store from "../store";
import { addProject } from "../store/projectsSlice";
import { PROJECT_FILE_NAME } from "../constants";
import {
  Project,
  Message,
  createTimestamps,
  updateTimestamp,
  ProjectListItem,
  ProjectSettings,
} from "../types";
import { openaiModels } from "../configs/aiModels";

const getEmptyProject = (projectPath: string): Project => ({
  id: Date.now(),
  path: projectPath,
  name: projectPath.split("/").pop() || "",
  settings: {
    service: "openai",
    model: openaiModels[0],
    temperature: 0,
    max_tokens: 4096,
  },
  messages: [],
  ...createTimestamps(),
});

export const selectProjectFolder =
  async (): Promise<ProjectListItem | null> => {
    try {
      const projectPath = await invoke("select_folder");
      if (typeof projectPath !== "string" || !projectPath) return null;
      const existingProject = store
        .getState()
        .projects.list.find((p) => p.path === projectPath);
      if (existingProject) {
        return existingProject;
      }
      const project = getEmptyProject(projectPath);
      store.dispatch(
        addProject({ id: project.id, path: project.path, name: project.name })
      );
      return project;
    } catch (error) {
      console.error("Failed to create project", error);
      return null;
    }
  };

export const saveProject = async (
  projectPath: string,
  project: Project
): Promise<void> => {
  const simpler_project_path = `${projectPath}/${PROJECT_FILE_NAME}`;
  try {
    const updatedProject = updateTimestamp(project);
    const result = await invoke("write_file", {
      filePath: simpler_project_path,
      content: JSON.stringify(updatedProject),
    });
    if (result !== null) {
      throw new Error(result as string);
    }
  } catch (error) {
    console.error("Failed to save project:", error);
    throw new Error("Failed to save project");
  }
};

export const getProject = async (
  projectPath: string
): Promise<Project | null> => {
  const simpler_project_path = `${projectPath}/${PROJECT_FILE_NAME}`;
  try {
    const fileExists = await invoke("file_exists", {
      filePath: simpler_project_path,
    });
    if (!fileExists) {
      // If the file doesn't exist, create a new empty simpler_project
      const newProject = getEmptyProject(projectPath);
      await saveProject(projectPath, newProject);
      return newProject;
    }

    const result = await invoke("read_file", {
      filePath: simpler_project_path,
    });
    if (typeof result !== "string") {
      throw new Error("Invalid project file content");
    }
    const project: Project = JSON.parse(result);
    // Sort messages by createdAt timestamp
    project.messages.sort((a, b) => a.createdAt - b.createdAt);
    return project;
  } catch (error) {
    console.error("Error reading project file:", error);
    // If there's any error, return a new empty project thread
    return null;
  }
};

export const addMessageToChat = async (
  projectPath: string,
  content: string,
  sender: "user" | "ai"
): Promise<void> => {
  let project = await getProject(projectPath);
  const newMessage: Message = {
    id: Date.now(),
    content,
    sender,
    ...createTimestamps(),
  };
  if (project) {
    project.messages.push(newMessage);
    await saveProject(projectPath, updateTimestamp(project) as Project);
  }
};

export const editMessage = async (
  projectPath: string,
  messageId: number,
  newContent: string
): Promise<void> => {
  const project = await getProject(projectPath);
  if (!project) {
    throw new Error("Project not found");
  }
  const messageIndex = project.messages.findIndex((m) => m.id === messageId);
  if (messageIndex === -1) {
    throw new Error("Message not found");
  }
  project.messages[messageIndex] = updateTimestamp({
    ...project.messages[messageIndex],
    content: newContent,
    sender: project.messages[messageIndex].sender,
    edited: true,
  }) as Message;
  await saveProject(projectPath, updateTimestamp(project) as Project);
};

export const deleteMessage = async (
  projectPath: string,
  messageId: number
): Promise<void> => {
  const project = await getProject(projectPath);
  if (!project) {
    throw new Error("Project not found");
  }
  project.messages = project.messages.filter((m) => m.id !== messageId);
  await saveProject(projectPath, updateTimestamp(project) as Project);
};

export const editProjectSettings = async (
  projectPath: string,
  settings: ProjectSettings
): Promise<void> => {
  const project = await getProject(projectPath);
  if (!project) {
    throw new Error("Project not found");
  }
  project.settings = settings;
  await saveProject(projectPath, updateTimestamp(project) as Project);
};
