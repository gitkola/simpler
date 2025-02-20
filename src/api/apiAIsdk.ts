import {
  fetch as tauriFetch,
  FetchOptions,
  HttpVerb,
  Body,
} from "@tauri-apps/api/http";
import {
  Message,
  generateText,
  GenerateTextResult,
  LanguageModel,
  Tool,
  ToolSet,
} from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import { logToJSONFile } from "@/lib/utils/logger";

export interface ICallAISDKOptions {
  model: LanguageModel;
  messages: Message[];
  system?: string;
  tools?: Record<string, Tool>;
  // maxToolRoundtrips: number;
  toolChoice?:
    | "auto"
    | "none"
    | "required"
    | { type: "tool"; toolName: string };
  temperature?: number;
  maxTokens?: number;
}

const fetchFunction = async (
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> => {
  console.log({ input, init });

  const response = await tauriFetch(input.toString(), {
    ...init,
    method: init?.method as HttpVerb,
    body: init?.body ? Body.json(JSON.parse(init.body as string)) : undefined,
  } as FetchOptions);

  const customHeaders = new Headers();
  Object.entries(response.headers).forEach(([key, value]) => {
    customHeaders.append(key, value);
  });

  return new Response(JSON.stringify(response.data), {
    status: response.status,
    headers: customHeaders,
  });
};

export const createModel = ({
  service,
  model,
  apiKey,
}: {
  service: string;
  model: string;
  apiKey: string;
}) => {
  let provider = null;
  switch (service) {
    case "openai":
      provider = createOpenAI({
        apiKey,
        compatibility: "strict",
        fetch: fetchFunction,
      });
      break;
    case "anthropic":
      provider = createAnthropic({
        apiKey,
        headers: { "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
        fetch: fetchFunction,
      });
      break;
  }
  return provider ? provider(model) : null;
};
export async function callAIsdk(
  options: ICallAISDKOptions
): Promise<GenerateTextResult<ToolSet, never>> {
  const result = await generateText(options);
  logToJSONFile("callAIsdk", { result, options }); // TODO: remove this line
  return result;
}
