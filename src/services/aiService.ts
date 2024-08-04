import axios from "axios";
import { fetch, HttpVerb } from "@tauri-apps/api/http";
import { Body, Response } from "@tauri-apps/api/http";
import { parseAIResponse } from "../utils/responseParser";
import { MessageContent, IProjectState } from "../types";
import {
  AI_INSTRUCTIONS_PROJECT_STATE,
  AI_INSTRUCTIONS_RESPONSE_GUIDELINES,
  AI_INSTRUCTIONS_RESPONSIBILITIES,
} from "../constants";

export const getAIResponse = async (
  message: string,
  service: string,
  model: string,
  apiKey: string,
  temperature: number,
  max_tokens: number
): Promise<MessageContent> => {
  if (service === "openai") {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model,
          messages: [
            { role: "system", content: AI_INSTRUCTIONS_RESPONSIBILITIES },
            { role: "system", content: AI_INSTRUCTIONS_RESPONSE_GUIDELINES },
            { role: "user", content: message },
          ],
          temperature,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );
      return parseAIResponse(response.data.choices[0].message.content);
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      throw error;
    }
  } else if (service === "anthropic") {
    try {
      const body = Body.json({
        max_tokens,
        temperature,
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
        model,
        system: `${AI_INSTRUCTIONS_RESPONSIBILITIES}\n\n${AI_INSTRUCTIONS_RESPONSE_GUIDELINES}`,
      });
      const response: Response<{
        content: Array<{ type: "text"; text: string }>;
      }> = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        timeout: 120,
        headers: {
          "x-api-key": apiKey,
          "Content-Type": "application/json",
          "anthropic-version": "2023-06-01",
        },
        body,
      });
      return parseAIResponse(response.data.content[0].text);
    } catch (error) {
      console.error("Error calling Anthropic API:", error);
      throw error;
    }
  } else {
    throw new Error("Invalid AI service selected");
  }
};

export const getAIResponseWithProjectState = async (
  message: string,
  projectState: IProjectState,
  service: string,
  model: string,
  apiKey: string,
  temperature: number,
  max_tokens: number
): Promise<{
  updatedProjectState: IProjectState;
  aiResponse: MessageContent;
}> => {
  const CURRENT_PROJECT_STATE = `#Current Project State
\`\`\`
${JSON.stringify(projectState, null, 2)}
\`\`\`
`;

  let aiResponse: MessageContent;
  let updatedProjectState: IProjectState = projectState;

  if (service === "openai") {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model,
          messages: [
            { role: "system", content: AI_INSTRUCTIONS_RESPONSIBILITIES },
            { role: "system", content: AI_INSTRUCTIONS_PROJECT_STATE },
            { role: "system", content: CURRENT_PROJECT_STATE },
            { role: "system", content: AI_INSTRUCTIONS_RESPONSE_GUIDELINES },
            { role: "user", content: message },
          ],
          temperature,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          timeout: 120000,
        }
      );
      aiResponse = parseAIResponse(response.data.choices[0].message.content);
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      throw error;
    }
  } else if (service === "anthropic") {
    try {
      const body = Body.json({
        max_tokens,
        temperature,
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
        model,
        system: `${AI_INSTRUCTIONS_RESPONSIBILITIES}\n\n${AI_INSTRUCTIONS_PROJECT_STATE}\n\n${CURRENT_PROJECT_STATE}\n\n${AI_INSTRUCTIONS_RESPONSE_GUIDELINES}`,
      });
      const options = {
        method: "POST" as HttpVerb,
        timeout: 120,
        headers: {
          "x-api-key": apiKey,
          "Content-Type": "application/json",
          "anthropic-version": "2023-06-01",
        },
        body,
      };
      const response: Response<{
        content: Array<{ type: "text"; text: string }>;
      }> = await fetch("https://api.anthropic.com/v1/messages", options);
      console.log(JSON.stringify({ options, response }, null, 2));

      aiResponse = parseAIResponse(response.data.content[0].text);
    } catch (error) {
      console.error("Error calling Anthropic API:", error);
      throw error;
    }
  } else {
    throw new Error("Invalid AI service selected");
  }

  const updatedStateItem = (aiResponse as MessageContent).find(
    (item) => "updated_project_state" in item
  );
  if (updatedStateItem && "updated_project_state" in updatedStateItem) {
    updatedProjectState =
      updatedStateItem.updated_project_state as IProjectState;
  }

  return { updatedProjectState, aiResponse: aiResponse as MessageContent };
};

export const getAIResponseWithProjectStateAndTools = async (
  message: string,
  projectState: IProjectState,
  service: string,
  model: string,
  apiKey: string,
  temperature: number,
  max_tokens: number
): Promise<{
  updatedProjectState: IProjectState;
  aiResponse: MessageContent;
}> => {
  const CURRENT_PROJECT_STATE = `#Current Project State
\`\`\`
${JSON.stringify(projectState, null, 2)}
\`\`\`
`;

  let aiResponse: MessageContent;
  let updatedProjectState: IProjectState = projectState;

  const writeFileTool = {
    name: "writeFile",
    description: "Write content to a file at the specified path",
    parameters: {
      type: "object",
      properties: {
        code: {
          type: "string",
          description: "The content to write to the file",
        },
        path: {
          type: "string",
          description: "The path where the file should be written",
        },
      },
      required: ["code", "path"],
    },
  };

  if (service === "openai") {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model,
          messages: [
            { role: "system", content: AI_INSTRUCTIONS_RESPONSIBILITIES },
            { role: "system", content: AI_INSTRUCTIONS_PROJECT_STATE },
            { role: "system", content: CURRENT_PROJECT_STATE },
            { role: "system", content: AI_INSTRUCTIONS_RESPONSE_GUIDELINES },
            { role: "user", content: message },
          ],
          functions: [writeFileTool],
          temperature,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          timeout: 120000,
        }
      );
      aiResponse = parseAIResponse(response.data.choices[0].message.content);
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      throw error;
    }
  } else if (service === "anthropic") {
    try {
      const body = Body.json({
        max_tokens,
        temperature,
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
        model,
        system: `${AI_INSTRUCTIONS_RESPONSIBILITIES}\n\n${AI_INSTRUCTIONS_PROJECT_STATE}\n\n${CURRENT_PROJECT_STATE}\n\n${AI_INSTRUCTIONS_RESPONSE_GUIDELINES}`,
        tools: [writeFileTool],
      });
      const options = {
        method: "POST" as HttpVerb,
        timeout: 120,
        headers: {
          "x-api-key": apiKey,
          "Content-Type": "application/json",
          "anthropic-version": "2023-06-01",
        },
        body,
      };
      const response: Response<{
        content: Array<{ type: "text"; text: string }>;
      }> = await fetch("https://api.anthropic.com/v1/messages", options);
      console.log(JSON.stringify({ options, response }, null, 2));

      aiResponse = parseAIResponse(response.data.content[0].text);
    } catch (error) {
      console.error("Error calling Anthropic API:", error);
      throw error;
    }
  } else {
    throw new Error("Invalid AI service selected");
  }

  const updatedStateItem = (aiResponse as MessageContent).find(
    (item) => "updated_project_state" in item
  );
  if (updatedStateItem && "updated_project_state" in updatedStateItem) {
    updatedProjectState =
      updatedStateItem.updated_project_state as IProjectState;
  }

  return { updatedProjectState, aiResponse: aiResponse as MessageContent };
};
