// import Anthropic from "@anthropic-ai/sdk";
import { Message } from "ai";
// import OpenAI from "openai";

export type ProjectPathListItem = string;

export type IMessageRole = "user" | "assistant" | "system";

export interface IBaseMessage extends Message {
  id: string;
  createdAt: Date;
  role: IMessageRole;
  content: string;
  parts: { type: "text"; text: string }[];
  // context?: Record<string, any>;
}

export type IMessage = Message | IBaseMessage;
// | (OpenAI.ChatCompletion & IBaseMessage)
// | (Anthropic.Message & IBaseMessage);

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
  status?: "todo" | "in_progress" | "completed" | "hold" | "canceled";
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
