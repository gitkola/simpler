import { fetch, FetchOptions, HttpVerb, Body } from "@tauri-apps/api/http";
import { logToJSONFile } from "../utils/logger";
import { IMessage } from "../types";

export const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
export const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
export type API_URL = typeof OPENAI_API_URL | typeof ANTHROPIC_API_URL;

export interface IOpenAIHeaders {
  Authorization: string;
  "Content-Type": string;
}
export interface IAnthropicHeaders {
  "x-api-key": string;
  "Content-Type": string;
  "anthropic-version": string;
}

export interface IRequestOptions extends FetchOptions {
  method: HttpVerb;
  timeout: number;
  headers: IOpenAIHeaders | IAnthropicHeaders;
  body: Body;
}

export async function callAIModelAPI(
  url: API_URL,
  options: IRequestOptions
): Promise<IMessage> {
  const response = await fetch<IMessage>(url, options);
  logToJSONFile({ options, response }, "callAIModelAPI");
  if (response.ok) {
    return response.data;
  } else {
    const errorMessage = `Error calling the API: ${response.status}`;
    console.error(errorMessage, response);
    throw new Error(errorMessage);
  }
}
