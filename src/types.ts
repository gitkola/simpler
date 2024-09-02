import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";

export type ProjectPathListItem = string;

export type IMessageRole = "user" | "assistant" | "system" | "app" | "tool";
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

export interface IProjectDescription {
  id: string;
  description?: string;
}

export interface IProjectRequirement {
  id: string;
  requirement?: string;
}

export interface IProjectTask {
  id: string;
  task?: string;
  status?: "todo" | "in_progress" | "completed" | "hold" | "no_need";
  suggested_as_next_task?: boolean;
}

export interface IProjectFile {
  path: string;
  content?: string | null;
}

export interface IProjectState {
  descriptions?: IProjectDescription[];
  requirements?: IProjectRequirement[];
  tasks?: IProjectTask[];
  files?: IProjectFile[];
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
