import axios from "axios";
import { fetch } from "@tauri-apps/api/http";
import { Body, Response } from "@tauri-apps/api/http";

import { parseAIResponse } from "../utils/responseParser";
import { IMessageContent, IProjectState } from "../types";

const AI_INSTRUCTIONS_RESPONSIBILITIES = `#Responsibilities
You are an AI assistant for Simpler application, a developer productivity tool.
Your role is to help users with coding tasks, explain concepts, and provide assistance with software development.
User's role is to provide to AI assistant project description and requirements, provide tasks, ask questions, check the AI assistant responses, request changes.
`;
const AI_INSTRUCTIONS_PROJECT_STATE = `#Project State
The Project State is a JSON object that represents the current state of the project.
It contains project name, description, version history, requirements, files, tasks, suggested tasks, current task, messages, sync state, settings, etc.
User may ask you to make changes to any field of the Project State JSON object, update tasks, files, requirements, etc.
You should understand the Project State, analyze it and respond according to these rules:
1. If project 'description' or 'requirements' are missing in the Project State, request them in your response.
2. Add or edit project 'files' according to the project 'description' and 'requirements'. Ensure each file has a valid path and appropriate content. File content should be empty until it processed with according task.
3. Add or edit project 'tasks' according to the project 'description' and 'requirements'. Each task should have a unique id, clear description, status, and priority.
4. If you don't understand the task, ask user to provide more details in your response;
5. If some data is missing for the task, request it in your response;
6. If you think the task is completed, update the Project State (files, tasks, statuses, other fields);
7. Always suggest most actual next tasks in 'suggested_tasks'. Provide 3-5 concrete, actionable tasks that align with the current Project State.
8. If you didn't update Project State, don't add it in your response.
9. If you updated Project State, add it as a JSON object to response with a clear indication of what was changed and why.
10. Ensure that the 'versionHistory' is updated when significant changes are made to the Project State.
`;
const AI_INSTRUCTIONS_RESPONSE_GUIDELINES = `#Response Guidelines
Always strive to give clear, concise, and accurate responses.
To support Simpler application, you need to provide responses in a specific format.
Don't include any comments outside the response format.
Respond in a JSON array format. Each item in the array should be an object with one of these structures:
1. {"title": "string"} - Use for main headings or to introduce new topics.
2. {"text": "string"} - Use for explanations, descriptions, or any non-code text.
3. {"code": ["code_string", "file_ext", "file_path", "description"]}
   - code_string: The actual code (required)
   - file_ext: File extension (e.g., "js", "py", "tsx"). Use null if unknown.
   - file_path: Suggested file path. Use null if not applicable.
   - description: Brief description of the code. Use null if not needed.
4. {"link": ["url", "description"]}
   - url: The URL of the link (required)
   - description: Brief description of the link. Use null if not provided.
5. {"updated_project_state": JSON object}
   - updated_project_state: Use this to provide the updated Project State to response when changes are made.

Ensure your response is well-structured and easy to understand. Use appropriate content types to organize your response effectively. If you update the Project State, always include both an explanation and the updated state in your response.`;

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
  const currentProjectState = `#Current Project State
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
            { role: "system", content: currentProjectState },
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
        system: `${AI_INSTRUCTIONS_RESPONSIBILITIES}\n\n${AI_INSTRUCTIONS_PROJECT_STATE}\n\n${currentProjectState}\n\n${AI_INSTRUCTIONS_RESPONSE_GUIDELINES}`,
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
