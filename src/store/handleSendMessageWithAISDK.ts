import { Message } from "ai";
import { AppDispatch, RootState } from ".";
import {
  createSystemPrompt,
  saveCurrentProjectConversation,
  setAIModelRequestError,
  setAIModelRequestInProgress,
  setCurrentProjectConversation,
} from "./currentProjectSlice";
import { callAIsdk, createModel, ICallAISDKOptions } from "../api/apiAIsdk";
import { defineTools } from "../tools/createTools";
import {
  getProjectStateDescriptionsTool,
  getProjectStateFilesTool,
  getProjectStateRequirementsTool,
  getProjectStateTasksTool,
  updateProjectStateTool,
} from "../tools/toolFunctions";

export const handleSendMessageWithAISDK =
  (message?: Message) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      dispatch(setAIModelRequestError(null));
      dispatch(setAIModelRequestInProgress(true));

      const {
        currentProjectSettings,
        currentProjectState,
        currentProjectConversation,
      } = getState().currentProject;

      if (!currentProjectState || !currentProjectSettings) {
        dispatch(
          setAIModelRequestError("ProjectState or Settings are not loaded")
        );
        dispatch(setAIModelRequestInProgress(false));
        return;
      }

      const context = getState().context;
      const { generalInstructions } = getState().settings.instructions;
      const apiKeys = getState().settings.apiKeys;
      const {
        service,
        model: modelName,
        temperature,
        max_tokens,
      } = currentProjectSettings;
      const model = createModel({
        service,
        model: modelName,
        apiKey: apiKeys[service],
      });
      if (!model) throw new Error("Model is not defined");
      let messages: Message[] = [...currentProjectConversation];
      if (message?.content) {
        messages.push(message);
      }
      const systemPrompt = createSystemPrompt(
        context,
        generalInstructions,
        currentProjectState
      );

      dispatch(setCurrentProjectConversation([...messages]));

      const tools = defineTools({
        updateProjectState: async ({ ProjectStateUpdates }) => {
          return await dispatch(updateProjectStateTool(ProjectStateUpdates));
        },
        getProjectStateFiles: async ({ paths }) => {
          return await dispatch(getProjectStateFilesTool({ paths }));
        },
        getProjectStateDescriptions: async () => {
          return await dispatch(getProjectStateDescriptionsTool());
        },
        getProjectStateRequirements: async () => {
          return await dispatch(getProjectStateRequirementsTool());
        },
        getProjectStateTasks: async () => {
          return await dispatch(getProjectStateTasksTool());
        },
      });

      const options: ICallAISDKOptions = {
        model,
        messages,
        tools,
        // maxToolRoundtrips: 10,
        toolChoice: "auto",
        temperature,
        maxTokens: max_tokens,
      };

      if (context.useSystemMessage) {
        options.system = systemPrompt;
      } else {
        options.messages = [
          {
            id: String(Date.now()),
            role: "user",
            content: systemPrompt,
          } as Message,
          ...messages,
        ];
      }

      const response: any = await callAIsdk(options);

      const { text } = response;
      const responseMessages = [
        { role: "assistant", content: [{ type: "text", text }] } as Message,
      ];
      dispatch(
        setCurrentProjectConversation([...messages, ...responseMessages])
      );

      // Save the conversation after each interaction
      await dispatch(
        saveCurrentProjectConversation([...messages, ...responseMessages])
      );
    } catch (error) {
      const errorMessage = `Error in handleSendMessageWithAISDK: ${
        typeof error === "string" ? error : (error as Error).message
      }`;
      console.error("handleSendMessageWithAISDK", error);
      dispatch(setAIModelRequestError(errorMessage));
    } finally {
      dispatch(setAIModelRequestInProgress(false));
    }
  };
