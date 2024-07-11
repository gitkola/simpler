import axios from "axios";
import { fetch } from "@tauri-apps/api/http";
import { Body, Response } from "@tauri-apps/api/http";

import { parseAIResponse } from "../utils/responseParser";
import { ModelResponse } from "../types";

const AI_INSTRUCTIONS = `You are an AI assistant for Simpler, a developer productivity tool. Your role is to help users with coding tasks, explain concepts, and provide assistance with software development. Always strive to give clear, concise, and accurate responses.
To support Client applications, you need to provide responses in a specific format.
Don't include any comments outside the response format.
Respond in a JSON array format. Each item in the array should be an object with one of these structures:
1. {"title": "string"} - Use for main headings or to introduce new topics.
2. {"text": "string"} - Use for explanations, descriptions, or any non-code text.
3. {"code": ["code_string", "file_ext", "file_path", "description"]}
   - code_string: The actual code (required)
   - file_ext: File extension (e.g., "js", "py", "tsx"). Use 0 if unknown.
   - file_path: Suggested file path. Use 0 if not applicable.
   - description: Brief description of the code. Use 0 if not needed.
4. {"link": ["url", "description"]}
   - url: The URL of the link (required)
   - description: Brief description of the link. Use 0 if not provided.

Ensure your response is well-structured and easy to understand. Use appropriate content types to organize your response effectively.`;

export const getAIResponse = async (
  message: string,
  service: string,
  model: string,
  apiKey: string,
  temperature: number,
  max_tokens: number
): Promise<ModelResponse> => {
  if (service === "openai") {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model,
          messages: [
            { role: "system", content: AI_INSTRUCTIONS },
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
        system: AI_INSTRUCTIONS,
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
