import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";

export type ProjectPathListItem = string;

export type IMessageRole = "user" | "assistant" | "system" | "app";
export type MessageService = "openai" | "anthropic" | "simpler";

export interface IBaseMessage {
  id: string;
  role: IMessageRole;
  content: string;
  service?: MessageService;
  model?: string;
  context?: Record<string, any>;
}

export type IMessage =
  | IBaseMessage
  | (OpenAI.ChatCompletion & IBaseMessage)
  | (Anthropic.Message & IBaseMessage);

export type Entity = IProjectState | IMessage;

export type MessageContent = ContentItem[];

export type ContentItem =
  | { title: string; id: number }
  | { text: string; id: number }
  | { code: CodeTuple; id: number }
  | { link: LinkTuple; id: number }
  | { ProjectStateUpdates: IProjectState; id?: number }
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
): item is { ProjectStateUpdates: IProjectState; id?: number } =>
  "ProjectStateUpdates" in item;

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
  status: "todo" | "in_progress" | "completed" | "hold" | "no_need";
  suggested_as_next_task: boolean;
  update?: TUpdate;
}

export interface IProjectFile {
  path: string;
  content?: string;
  update?: TUpdate;
}

export interface IProjectState {
  name: string;
  descriptions?: IProjectDescription[];
  requirements?: IProjectRequirement[];
  files?: IProjectFile[];
  tasks?: IProjectTask[];
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
