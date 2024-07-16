export type ProjectPathListItem = string;

export type IMessageAction =
  | "generate_tasks_and_files"
  | "generate_suggested_tasks"
  | "suggestion";

export type IMessageRole = "user" | "assistant" | "system" | "app";

export interface IMessage {
  role: IMessageRole;
  content: IMessageContent | string;
  createdAt: number;
  updatedAt: number;
  action?: IMessageAction;
}

export type Entity = IProjectState | IMessage;

export const createTimestamps = () => {
  const now = Date.now();
  return { createdAt: now, updatedAt: now };
};

export const updateTimestamp = (entity: Entity) => {
  return { ...entity, updatedAt: Date.now() };
};

export type IMessageContent = ContentItem[];

export type ContentItem =
  | { title: string }
  | { text: string }
  | { code: CodeTuple }
  | { link: LinkTuple }
  | { updated_project_state: IProjectState };

export type CodeTuple = [
  string, // code content (required)
  string | null, // file extension (optional)
  string | null, // file path (optional)
  string | null // description (optional)
];

export type LinkTuple = [
  string, // URL (required)
  string | null // description (optional)
];

// Type guard functions
export const isTitle = (item: ContentItem): item is { title: string } =>
  "title" in item;
export const isText = (item: ContentItem): item is { text: string } =>
  "text" in item;
export const isCode = (item: ContentItem): item is { code: CodeTuple } =>
  "code" in item;
export const isLink = (item: ContentItem): item is { link: LinkTuple } =>
  "link" in item;
export const isUpdatedProjectState = (
  item: ContentItem
): item is { updated_project_state: IProjectState } =>
  "updated_project_state" in item;

// Get type function
export const getType = (
  item: ContentItem
): "title" | "text" | "code" | "link" => {
  if (isTitle(item)) return "title";
  if (isText(item)) return "text";
  if (isCode(item)) return "code";
  if (isLink(item)) return "link";
  throw new Error("Unknown content type");
};

// Helper function to create a code item
export const createCodeItem = (
  code: string,
  fileExtension: string | null = null,
  path: string | null = null,
  description: string | null = null
): { code: CodeTuple } => ({
  code: [code, fileExtension, path, description],
});

// Helper function to create a link item
export const createLinkItem = (
  url: string,
  description: string | null = null
): { link: LinkTuple } => ({
  link: [url, description],
});

export interface FileMetadata {
  lastSynced?: number;
  status?: "created" | "modified" | "deleted";
  coverage?: number;
  [key: string]: any;
}

export interface ProjectFile {
  path: string;
  content: string | null;
  createdAt: number;
  updatedAt: number;
  metadata: FileMetadata;
}

export interface Requirement {
  id: string;
  description: string;
  status: "not_started" | "in_progress" | "completed";
  priority: "low" | "medium" | "high";
  createdAt: number;
  updatedAt: number;
}

export interface VersionInfo {
  version: string;
  timestamp: number;
  description: string;
}

export interface SyncState {
  lastSynced: number | null;
  status:
    | "initial"
    | "synced"
    | "local_changes"
    | "remote_changes"
    | "conflict";
}

export interface ProjectTask {
  id: string;
  description: string;
  status: "todo" | "in_progress" | "done";
  createdAt: number;
  updatedAt: number;
}

export interface ProjectSettings {
  service: "openai" | "anthropic";
  model: string;
  temperature: number;
  max_tokens: number;
  indentation?: "spaces" | "tabs";
  indentationSize?: number;
  lineEnding?: "LF" | "CRLF";
}

export interface IProjectState {
  name: string;
  versionHistory: VersionInfo[];
  description: string;
  requirements: Requirement[];
  files: ProjectFile[];
  ai_instructions: string[];
  tasks: ProjectTask[];
  suggested_tasks?: ProjectTask[];
  current_task: ProjectTask | null;
  messages?: IMessage[];
  syncState: SyncState;
  settings: ProjectSettings;
  createdAt: number;
  updatedAt: number;
  metadata: { [key: string]: any };
}
