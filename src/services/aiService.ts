import axios from "axios";
import { fetch, HttpVerb } from "@tauri-apps/api/http";
import { Body, Response } from "@tauri-apps/api/http";
import { parseAIResponse } from "../utils/responseParser";
import { MessageContent, IProjectState, IMessage } from "../types";
import {
  AI_INSTRUCTIONS_PROJECT_STATE,
  AI_INSTRUCTIONS_RESPONSE_GUIDELINES,
  AI_INSTRUCTIONS_RESPONSIBILITIES,
} from "../constants";
import {
  ANTHROPIC_API_URL,
  API_URL,
  callAIModelAPI,
  IRequestOptions,
  OPENAI_API_URL,
} from "../api/apiAIModels";

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
        OPENAI_API_URL,
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
      }> = await fetch(ANTHROPIC_API_URL, {
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
        OPENAI_API_URL,
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
      }> = await fetch(ANTHROPIC_API_URL, options);
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
    (item) => "project_state_updates" in item
  );
  if (updatedStateItem && "project_state_updates" in updatedStateItem) {
    updatedProjectState =
      updatedStateItem.project_state_updates as IProjectState;
  }

  return { updatedProjectState, aiResponse: aiResponse as MessageContent };
};

export const getAIResponseWithProjectStateAndTools = async (
  url: API_URL,
  options: IRequestOptions
): Promise<IMessage> => {
  const response = await callAIModelAPI(url, options);
  return response;
};
