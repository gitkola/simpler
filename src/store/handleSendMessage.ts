import { Body } from "@tauri-apps/api/http";
import { AppDispatch, RootState } from ".";
import {
  ANTHROPIC_API_URL,
  API_URL,
  callAIModelAPI,
  IRequestOptions,
  OPENAI_API_URL,
} from "@/api/apiAIModels";
import { createTools } from "@/tools/createTools";
import { IMessage } from "@/types";
import {
  addMessageToThread,
  createSystemPrompt,
  setAIModelRequestError,
  setAIModelRequestInProgress,
} from "@/store/currentProjectSlice";
import createBaseMessage from "@/lib/utils/createBaseMessage";
import { Message } from "ai";

export const handleSendMessage =
  (message: Message) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      dispatch(setAIModelRequestError(null));
      dispatch(setAIModelRequestInProgress(true));

      const projectSettings = getState().currentProject.currentProjectSettings;
      const currentProjectState = getState().currentProject.currentProjectState;

      const context = getState().context;
      const { generalInstructions } = getState().settings.instructions;

      if (!currentProjectState || !projectSettings) {
        dispatch(
          setAIModelRequestError("ProjectState or Settings are not loaded")
        );
        dispatch(setAIModelRequestInProgress(false));
        return;
      }
      const apiKeys = getState().settings.apiKeys;
      const { service, model, temperature, max_tokens } = projectSettings;

      let url: API_URL;
      let options: IRequestOptions;
      const tools = createTools(service);
      let messages = [];
      const systemPrompt = createSystemPrompt(
        context,
        generalInstructions,
        currentProjectState
      );

      const userMessage = `${message?.content}`;
      if (service === "openai") {
        if (systemPrompt)
          messages.push({ role: "system", content: systemPrompt });
        messages.push({ role: "user", content: userMessage });
        url = OPENAI_API_URL;
        const body = Body.json({
          model,
          max_tokens,
          temperature,
          frequency_penalty: 0,
          presence_penalty: 0,
          messages,
          tools,
        });

        options = {
          method: "POST",
          timeout: 120,
          headers: {
            Authorization: `Bearer ${apiKeys[service]}`,
            "Content-Type": "application/json",
          },
          body,
        };
      } else if (service === "anthropic") {
        messages.push({ role: "user", content: userMessage });
        url = ANTHROPIC_API_URL;
        const body = Body.json({
          model,
          system: systemPrompt,
          messages,
          tools,
          max_tokens,
          temperature,
        });

        options = {
          method: "POST",
          timeout: 120,
          headers: {
            "x-api-key": apiKeys[service],
            "Content-Type": "application/json",
            "anthropic-version": "2023-06-01",
          },
          body,
        };
      } else {
        throw new Error("Invalid AI service selected");
      }
      const systemMessage = createBaseMessage(systemPrompt, "system");
      await dispatch(addMessageToThread(systemMessage as IMessage));

      await dispatch(addMessageToThread(message as IMessage));
      const response = await callAIModelAPI(url, options);
      await dispatch(
        addMessageToThread({
          ...response,
          // context: message,
          // service,
        })
      );
    } catch (error) {
      const errorMessage = `Error in handleSendMessage: ${
        typeof error === "string" ? error : (error as Error).message
      }`;
      console.error(error);
      dispatch(setAIModelRequestError(errorMessage));
    } finally {
      dispatch(setAIModelRequestInProgress(false));
    }
  };
