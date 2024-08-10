import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";

export type ProjectPathListItem = string;

export type IMessageRole = "user" | "assistant" | "system" | "app";
export type MessageService = "openai" | "anthropic" | "simpler";

export interface IBaseMessage {
  id: string;
  role: IMessageRole;
  content: string;
  createdAt?: number;
  updatedAt?: number;
  service?: MessageService;
  model?: string;
  context?: Record<string, any>;
}

export type IMessage =
  | IBaseMessage
  | (OpenAI.ChatCompletion & IBaseMessage)
  | (Anthropic.Message & IBaseMessage);

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
  | { project_state_updates: IProjectState; id?: number }
  | { error: ErrorTuple; id: number };

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

export type ErrorTuple = [
  string, // error message
  string | null // description
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
): item is { project_state_updates: IProjectState; id?: number } =>
  "project_state_updates" in item;

export type TUpdate = "add" | "modify" | "delete";

export interface IProjectDescription {
  id: number;
  description: string;
  update?: TUpdate;
}

export interface IProjectRequirement {
  id: number;
  requirement: string;
  update?: TUpdate;
}

export interface IProjectTask {
  id: number;
  task: string;
  status: "todo" | "in_progress" | "done" | "hold" | "no_need";
  suggested_as_next_task: boolean;
  update?: TUpdate;
}

export interface IProjectFile {
  path: string;
  content: string | null;
  update?: TUpdate;
}

export interface IProjectState {
  name: string;
  descriptions?: IProjectDescription[];
  requirements?: IProjectRequirement[];
  files?: IProjectFile[];
  tasks?: IProjectTask[];
  createdAt: number;
  updatedAt: number;
  context?: Record<string, any>;
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
