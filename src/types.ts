export type ProjectPathListItem = string;

export type IMessageAction =
  | "generate_tasks_and_files"
  | "generate_suggested_tasks"
  | "suggestion";

export type IMessageRole = "user" | "assistant" | "system" | "app";

export interface IMessage {
  id: number;
  role: IMessageRole;
  content: MessageContent | string;
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

export type MessageContent = ContentItem[];

export type ContentItem =
  | { title: string; id: number }
  | { text: string; id: number }
  | { code: CodeTuple; id: number }
  | { link: LinkTuple; id: number }
  | { updated_project_state: IProjectState; id: number };

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
export const isTitle = (
  item: ContentItem
): item is { title: string; id: number } => "title" in item;
export const isText = (
  item: ContentItem
): item is { text: string; id: number } => "text" in item;
export const isCode = (
  item: ContentItem
): item is { code: CodeTuple; id: number } => "code" in item;
export const isLink = (
  item: ContentItem
): item is { link: LinkTuple; id: number } => "link" in item;
export const isUpdatedProjectState = (
  item: ContentItem
): item is { updated_project_state: IProjectState; id: number } =>
  "updated_project_state" in item;

export interface IProjectFile {
  id: number;
  path: string;
  content: string | null;
  status: "planned" | "created" | "modified" | "deleted";
  createdAt: number;
  updatedAt: number;
  update?: "add" | "modify" | "delete" | "synced";
}

export interface IProjectRequirement {
  id: number;
  description: string;
  createdAt: number;
  updatedAt: number;
  update?: "add" | "modify" | "delete" | "synced";
}

export interface IProjectTask {
  id: number;
  description: string;
  status: "todo" | "in_progress" | "done";
  suggested_as_next_task: boolean;
  createdAt: number;
  updatedAt: number;
  update?: "add" | "modify" | "delete" | "synced";
}

export interface IProjectState {
  name: string;
  description?: string | null;
  requirements?: IProjectRequirement[];
  files?: IProjectFile[];
  tasks?: IProjectTask[];
  createdAt: number;
  updatedAt: number;
}

export interface IProjectSettings {
  service: "openai" | "anthropic";
  model: string;
  temperature: number;
  max_tokens: number;
  indentation?: "spaces" | "tabs";
  indentationSize?: number;
  lineEnding?: "LF" | "CRLF";
}
