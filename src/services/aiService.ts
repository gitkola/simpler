import axios from "axios";
import { fetch } from "@tauri-apps/api/http";
import { Body, Response } from "@tauri-apps/api/http";
import { parseAIResponse } from "../utils/responseParser";
import { IMessageContent, IProjectState } from "../types";
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
): Promise<IMessageContent> => {
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
        timeout: 30,
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
  aiResponse: IMessageContent;
}> => {
  const CURRENT_PROJECT_STATE = `#Current Project State
\`\`\`
${JSON.stringify(projectState, null, 2)}
\`\`\`
`;

  let aiResponse: IMessageContent;
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
      const response: Response<{
        content: Array<{ type: "text"; text: string }>;
      }> = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        timeout: 30,
        headers: {
          "x-api-key": apiKey,
          "Content-Type": "application/json",
          "anthropic-version": "2023-06-01",
        },
        body,
      });
      aiResponse = parseAIResponse(response.data.content[0].text);
    } catch (error) {
      console.error("Error calling Anthropic API:", error);
      throw error;
    }
  } else {
    throw new Error("Invalid AI service selected");
  }

  const updatedStateItem = (aiResponse as IMessageContent).find(
    (item) => "updated_project_state" in item
  );
  if (updatedStateItem && "updated_project_state" in updatedStateItem) {
    updatedProjectState =
      updatedStateItem.updated_project_state as IProjectState;
  }

  return { updatedProjectState, aiResponse: aiResponse as IMessageContent };
};
