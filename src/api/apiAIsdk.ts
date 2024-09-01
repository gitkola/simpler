import {
  fetch as tauriFetch,
  FetchOptions,
  HttpVerb,
  Body,
} from "@tauri-apps/api/http";
import {
  CoreMessage,
  CoreTool,
  generateText,
  GenerateTextResult,
  LanguageModel,
} from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";

export interface ICallAISDKOptions {
  model: LanguageModel;
  messages: CoreMessage[];
  system: string;
  tools: Record<string, CoreTool>;
  maxToolRoundtrips: number;
  toolChoice: "auto" | "none" | "required" | { type: "tool"; toolName: string };
  temperature: number;
  maxTokens: number;
}

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
      provider = createOpenAI({ apiKey, compatibility: "strict" });
      break;
    case "anthropic":
      provider = createAnthropic({
        apiKey,
        headers: { "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
        fetch: async (
          input: RequestInfo | URL,
          init?: RequestInit
        ): Promise<Response> => {
          console.log({ input, init });

          const response = await tauriFetch(input.toString(), {
            ...init,
            method: init?.method as HttpVerb,
            body: init?.body
              ? Body.json(JSON.parse(init.body as string))
              : undefined,
          } as FetchOptions);

          const customHeaders = new Headers();
          Object.entries(response.headers).forEach(([key, value]) => {
            customHeaders.append(key, value);
          });

          return new Response(JSON.stringify(response.data), {
            status: response.status,
            headers: customHeaders,
          });
        },
      });
      break;
  }
  return provider ? provider(model) : null;
};
export async function callAIsdk(
  options: ICallAISDKOptions
): Promise<GenerateTextResult<Record<string, CoreTool>>> {
  const result = await generateText(options);
  return result;
}

// Allow streaming responses up to 60 seconds
// export const maxDuration = 60;

// const anthropic = createAnthropic({
//   apiKey:
// });
// const model = anthropic("claude-3-5-sonnet-20240620");
// // const model = openai("gpt-4o-mini-2024-07-18");

// export async function POST(req: Request) {
//   const { messages } = await req.json();

//   const result = await streamText({
//     model,
//     messages: convertToCoreMessages(messages),
//     system:
//       "As a **Highly Qualified Developer Assistant AI**, your primary role is to support software development tasks across all stages of the project lifecycle. Your responsibilities include requirement analysis, task formulation, architecture design, code generation, testing, documentation, debugging, code optimization, refactoring, scaling, and answering project-related questions.",
//   });
//   console.log({ messages, result });

//   return result.toDataStreamResponse();
// }
