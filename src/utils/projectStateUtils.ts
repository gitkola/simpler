import { invoke } from "@tauri-apps/api/tauri";
import {
  IMessage,
  ProjectPathListItem,
  IProjectState,
  createTimestamps,
  updateTimestamp,
} from "../types";
import {
  PROJECT_MESSAGES_FILE_NAME,
  PROJECT_STATE_FILE_NAME,
} from "../constants";
import { getFolderNameFromPath } from "./getFolderNameFromPath";
import { openaiModels } from "../configs/aiModels";
import store from "../store";
import { addProject } from "../store/projectsSlice";

export const generateInitialProjectState = (
  projectPath: string
): IProjectState => {
  const { createdAt, updatedAt } = createTimestamps();
  return {
    name: getFolderNameFromPath(projectPath),
    description: "",
    versionHistory: [
      {
        version: "0.0.0",
        timestamp: createdAt,
        description: "Initial Project State.",
      },
    ],
    requirements: [],
    files: [],
    ai_instructions: [
      "You are an AI assistant for software development. Your task is to help create and improve code, project structure, and documentation.",
      "Analyze the current state of the project and provide recommendations for the next steps in development in 'suggested_tasks'.",
      "Answer the developer's questions and generate code according to the project requirements.",
      "If there are no tasks or the existing tasks are not relevant to the current description and requirements, create or edit tasks according to the ProjectTask interface.",
      "If there are no files or the existing files are not relevant to the current description and requirements, create or edit files according to the ProjectFile interface.",
      "Always keep the Project State up-to-date and consistent with the current development stage.",
      "Understand and use the following interfaces when working with the Project State:",
      "ProjectTask: { id: string, description: string, status: 'todo' | 'in_progress' | 'done', createdAt: number, updatedAt: number }",
      "ProjectFile: { path: string, content: string | null, createdAt: number, updatedAt: number, metadata: { [key: string]: any } }",
      "SyncState: { lastSynced: number | null, status: 'initial' | 'synced' | 'local_changes' | 'remote_changes' | 'conflict' }",
      "Requirement: { id: string, description: string, status: 'not_started' | 'in_progress' | 'completed', priority: 'low' | 'medium' | 'high' }",
      "When modifying the Project State, ensure all changes adhere to these interfaces.",
    ],
    tasks: [],
    suggested_tasks: [],
    current_task: null,
    syncState: { lastSynced: null, status: "initial" },
    settings: {
      service: "openai",
      model: openaiModels[0],
      temperature: 0,
      max_tokens: 4096,
      indentation: "spaces",
      indentationSize: 2,
      lineEnding: "LF",
    },
    createdAt,
    updatedAt,
    metadata: {},
  };
};

export const saveProjectState = async (
  projectPath: string,
  projectState: IProjectState
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
    console.error("Failed to save Project State:", error);
    throw new Error("Failed to save Project State");
  }
};

export const getProjectState = async (
  projectPath: string
): Promise<IProjectState | null> => {
  const projectStateFilePath = `${projectPath}/${PROJECT_STATE_FILE_NAME}`;
  try {
    const fileExists = await invoke("file_exists", {
      filePath: projectStateFilePath,
    });
    if (!fileExists) {
      // If the file doesn't exist, create a new empty Project State
      const newProjectState = generateInitialProjectState(projectPath);
      await saveProjectState(projectPath, newProjectState);
      return newProjectState;
    }

    const result = await invoke("read_file", {
      filePath: projectStateFilePath,
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
    await saveProjectState(projectPath, newProjectState);
    return newProjectState;
  }
};

export const saveProjectMessages = async (
  projectPath: string,
  messages: IMessage[]
) => {
  const messagesFilePath = `${projectPath}/${PROJECT_MESSAGES_FILE_NAME}`;
  try {
    const result = await invoke("write_file", {
      filePath: messagesFilePath,
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

export const getProjectMessages = async (
  projectPath: string
): Promise<IMessage[]> => {
  const messagesFilePath = `${projectPath}/${PROJECT_MESSAGES_FILE_NAME}`;
  try {
    const fileExists = await invoke("file_exists", {
      filePath: messagesFilePath,
    });
    if (!fileExists) {
      return [];
    }
    const result = await invoke("read_file", {
      filePath: messagesFilePath,
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
  return {
    ...prevState,
    ...nextState,
    versionHistory: [
      ...prevState.versionHistory,
      ...nextState.versionHistory.filter(
        (v) => !prevState.versionHistory.some((pv) => pv.version === v.version)
      ),
    ],
    requirements: [
      ...prevState.requirements,
      ...nextState.requirements.filter(
        (r) => !prevState.requirements.some((pr) => pr.id === r.id)
      ),
    ],
    files: [
      ...prevState.files,
      ...nextState.files.filter(
        (f) => !prevState.files.some((pf) => pf.path === f.path)
      ),
    ].sort((a, b) => a.path.localeCompare(b.path)),
    tasks: [
      ...prevState.tasks,
      ...nextState.tasks.filter(
        (t) => !prevState.tasks.some((pt) => pt.id === t.id)
      ),
    ],
    suggested_tasks: [
      ...nextState?.suggested_tasks?.filter(
        (st) => !prevState?.suggested_tasks?.some((pst) => pst.id === st.id)
      ),
    ],
  };
};
