import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "."; // Assuming you have this type defined in your store file
import {
  callAIModelAPI,
  IRequestOptions,
  OPENAI_API_URL,
} from "../api/apiAIModels";
import { Body } from "@tauri-apps/api/http";
import OpenAI from "openai";

export interface Message {
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  tool_calls?: Array<{
    id: string;
    function: { arguments: string; name: string };
    type: "function";
  }>;
  tool_call_id?: string;
}

interface ThreadState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ThreadState = {
  messages: [],
  isLoading: false,
  error: null,
};

const systemPrompt = `# Your Role
You are a helpful assistant.
You must perform software project development tasks such as designing the architecture and file structure of the project, generating code, tests, documentation, finding and fixing bugs in the code, optimizing and refactoring the code. 
To add code snippets to a response, you need to call the \`responseWithCode\` function:
- \`responseWithCode({code: string, language: string, path?: string}) => void\` - Call this function to respond with code in the specified language and optional relative path in the project folder.
`;
// Please use these functions when appropriate for calculations. If you gonna respond with result of calculations use responseWithResult function. If a calculation is not needed, you can respond normally.

const toolFunctions = [
  {
    type: "function",
    function: {
      name: "responseWithCode",
      strict: true,
      description:
        "User expects that the code would be returned as an argument of this function",
      parameters: {
        type: "object",
        properties: {
          code: { type: "string", description: "The code" },
          language: { type: "string", description: "The language of the code" },
          path: {
            type: "string",
            description: "The relative path of the file in the project folder",
          },
        },
        required: ["code", "language", "path"],
        additionalProperties: false,
      },
    },
  },
];

const threadSlice = createSlice({
  name: "thread",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addMessage: (state, action: PayloadAction<Omit<Message, "id">>) => {
      state.messages.push({
        ...action.payload,
      });
    },
    setThreadMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
  },
});

export const { setLoading, setError, addMessage, setThreadMessages } =
  threadSlice.actions;

export const handleSendMessage =
  (message: string): AppThunk =>
  async (dispatch, getState) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    const state = getState();
    const currentMessages = state.thread.messages;

    // Add system message if it's not already present
    if (currentMessages.length === 0 || currentMessages[0].role !== "system") {
      dispatch(addMessage({ role: "system", content: systemPrompt }));
    }

    // Add user message
    dispatch(addMessage({ role: "user", content: message }));

    const messages = [
      { role: "system", content: systemPrompt },
      ...currentMessages,
      { role: "user", content: message },
    ];

    try {
      const body = Body.json({
        model: state.currentProject.currentProjectSettings?.model,
        max_tokens: 4096,
        temperature: 0,
        frequency_penalty: 0,
        presence_penalty: 0,
        messages,
        tools: toolFunctions,
      });

      const options: IRequestOptions = {
        method: "POST",
        timeout: 120,
        headers: {
          Authorization: `Bearer ${state.settings.apiKeys.openai}`,
          "Content-Type": "application/json",
        },
        body,
      };
      const response = await callAIModelAPI(OPENAI_API_URL, options);

      const assistantMessage = (response as OpenAI.ChatCompletion).choices[0]
        .message;

      // Add assistant message
      dispatch(addMessage(assistantMessage as Message));

      if (Array.isArray(assistantMessage.tool_calls)) {
        const toolResults: Message[] = [];

        for (const toolCall of assistantMessage.tool_calls) {
          const {
            id,
            function: { name, arguments: args },
          } = toolCall;
          const parsedArgs = JSON.parse(args);

          let result;
          switch (name) {
            case "sum":
              result = sum(parsedArgs.firstNumber, parsedArgs.secondNumber);
              break;
            case "multiply":
              result = multiply(
                parsedArgs.firstNumber,
                parsedArgs.secondNumber
              );
              break;
            case "responseWithResult":
              responseWithResult(parsedArgs.result);
              result = parsedArgs.result;
              dispatch(
                addMessage({
                  role: "assistant",
                  content: `The result is ${parsedArgs.result}`,
                })
              );
              dispatch(setLoading(false));
              break;
            case "responseWithCode":
              responseWithCode(parsedArgs.code);
              result = "Ok";
              break;
            default:
              return;
          }

          if (result !== undefined) {
            const toolMessage = {
              role: "tool",
              content: JSON.stringify({
                operation: name,
                result,
              }),
              tool_call_id: id,
            };
            toolResults.push(toolMessage as Message);
            // Add tool message
            dispatch(addMessage(toolMessage as Message));
          }
        }

        if (toolResults.length > 0) {
          const newMessages = [
            ...messages,
            assistantMessage as Message,
            ...toolResults,
          ];

          const completionBody = Body.json({
            model: state.currentProject.currentProjectSettings?.model,
            max_tokens: 4096,
            temperature: 0,
            frequency_penalty: 0,
            presence_penalty: 0,
            messages: newMessages,
          });

          const completionOptions: IRequestOptions = {
            method: "POST",
            timeout: 120,
            headers: {
              Authorization: `Bearer ${state.settings.apiKeys.openai}`,
              "Content-Type": "application/json",
            },
            body: completionBody,
          };

          const completionResponse = await callAIModelAPI(
            OPENAI_API_URL,
            completionOptions
          );
          const completionMessage = (
            completionResponse as OpenAI.ChatCompletion
          ).choices[0].message;

          // Add final assistant message
          dispatch(addMessage(completionMessage as Message));
        }
      }

      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setError("Failed to send message to AI model"));
      dispatch(setLoading(false));
    }
  };

export default threadSlice.reducer;

const sum = (firstNumber: number, secondNumber: number) =>
  firstNumber + secondNumber;
const multiply = (firstNumber: number, secondNumber: number) =>
  firstNumber * secondNumber;
const responseWithResult = (result: number) => {
  console.log("The result is:::::::::", result);
};
const responseWithCode = (code: string) => {
  console.log("The code is:::::::::", code);
};

// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import Anthropic from "@anthropic-ai/sdk";
// import OpenAI from "openai";
// import { AppDispatch, RootState } from ".";
// import { readFile, writeFile } from "../services/fsService";

/*
  Anthropic.Message {
    id: string;
    role: 'assistant';
    content: Array<ContentBlock>; // [{ "type": "text", "text": "Hi, I'm Claude." }] 
    model: Model;
    stop_reason: 'end_turn' | 'max_tokens' | 'stop_sequence' | 'tool_use' | null;
    stop_sequence: string | null;
    type: 'message';
    usage: Usage;
  }
  type ContentBlock = TextBlock | ToolUseBlock;
  interface TextBlock {
    text: string;
    type: 'text';
  }
  export interface ToolUseBlock {
    id: string;
    input: unknown;
    name: string;
    type: 'tool_use';
  }
  export type Model =
    | (string & {})
    | 'claude-3-5-sonnet-20240620'
    | 'claude-3-opus-20240229'
    | 'claude-3-sonnet-20240229'
    | 'claude-3-haiku-20240307'
    | 'claude-2.1'
    | 'claude-2.0'
    | 'claude-instant-1.2';
  export interface Usage {
    input_tokens: number;
    output_tokens: number;
  }


  OpenAI.ChatCompletionMessage {
    content: string | null;
    role: 'assistant';
    tool_calls?: Array<ChatCompletionMessageToolCall>;
  }
  export interface ChatCompletionMessageToolCall {
    id: string;
    function: ChatCompletionMessageToolCall.Function;
    type: 'function';
  }
  export interface Function {
    // The arguments to call the function with, as generated by the model in JSON
    // format. Note that the model does not always generate valid JSON, and may
    // hallucinate parameters not defined by your function schema. Validate the
    // arguments in your code before calling your function.
    arguments: string;
    name: string;
  }
*/

// export interface IThreadSystemMessage {
//   role: "system";
//   content: string;
// }

// export interface IThreadUserMessage {
//   role: "user";
//   content: string;
// }

// export type IThreadMessage =
//   | IThreadSystemMessage
//   | IThreadUserMessage
//   | Anthropic.Message
//   | OpenAI.ChatCompletionMessage;

// export interface IThreadState {
//   threadPaths: string[];
//   threadPath: string | null;
//   threadMessages: Array<IThreadMessage>;
//   threadError: string | null;
//   processing: boolean;
// }

// const defaultInitialState: IThreadState = {
//   threadPaths: [],
//   threadPath: null,
//   threadMessages: [],
//   threadError: null,
//   processing: false,
// };

// const threadSlice = createSlice({
//   name: "thread",
//   initialState: defaultInitialState,
//   reducers: {
//     setThreadPaths: (
//       state,
//       action: PayloadAction<IThreadState["threadPaths"]>
//     ) => {
//       state.threadPaths = action.payload;
//     },
//     setThreadPath: (
//       state,
//       action: PayloadAction<IThreadState["threadPath"]>
//     ) => {
//       state.threadPath = action.payload;
//     },
//     setThreadMessages: (
//       state,
//       action: PayloadAction<IThreadState["threadMessages"]>
//     ) => {
//       state.threadMessages = action.payload;
//     },
//     setThreadError: (
//       state,
//       action: PayloadAction<IThreadState["threadError"]>
//     ) => {
//       state.threadError = action.payload;
//     },
//     setProcessing: (
//       state,
//       action: PayloadAction<IThreadState["processing"]>
//     ) => {
//       state.processing = action.payload;
//     },
//     setProcessingThread: (state) => {
//       state.processing = true;
//       state.threadError = null;
//     },
//     setProcessingThreadSuccess: (
//       state,
//       action: PayloadAction<IThreadMessage[]>
//     ) => {
//       state.processing = false;
//       state.threadMessages = action.payload;
//       state.threadError = null;
//     },
//     setProcessingThreadFailure: (state, action: PayloadAction<string>) => {
//       state.processing = false;
//       state.threadError = action.payload;
//     },
//   },
// });

// export const {
//   setThreadPaths,
//   setThreadPath,
//   setThreadMessages,
//   setThreadError,
//   setProcessing,
//   setProcessingThread,
//   setProcessingThreadSuccess,
//   setProcessingThreadFailure,
// } = threadSlice.actions;

// export default threadSlice.reducer;

// const createThreadName = () => `threads/thread-${Date.now()}.json`;

// const handleError = (
//   error: unknown,
//   prefix?: string,
//   action?: (msg: string) => void
// ) => {
//   const errorMessage = `${prefix ? prefix : ""} ${
//     typeof error === "string" ? error : (error as Error).message
//   }`;
//   console.log(errorMessage);
//   if (action) action(errorMessage);
// };

// export const loadThread =
//   (threadPath: string) =>
//   async (dispatch: AppDispatch, getState: () => RootState) => {
//     try {
//       dispatch(setProcessingThread());
//       dispatch(setThreadPath(threadPath));
//       const activeProjectPath = getState().projects.activeProjectPath;
//       const path = `${activeProjectPath}/${threadPath}`;
//       const result = await readFile(path);
//       const threadMessages: IThreadMessage[] = JSON.parse(result);
//       dispatch(setProcessingThreadSuccess(threadMessages));
//     } catch (error) {
//       handleError(error, "Error loadThread:", (msg) =>
//         dispatch(setProcessingThreadFailure(msg))
//       );
//     }
//   };

// export const saveThread =
//   (threadPath: string, threadMessages: IThreadMessage[]) =>
//   async (dispatch: AppDispatch, getState: () => RootState) => {
//     try {
//       dispatch(setProcessingThread());
//       const activeProjectPath = getState().projects.activeProjectPath;
//       const path = `${activeProjectPath}/${threadPath}`;
//       await writeFile(path, JSON.stringify(threadMessages, null, 2));
//       dispatch(setProcessing(false));
//     } catch (error) {
//       handleError(error, "Error saveThread:", (msg) =>
//         dispatch(setThreadError(msg))
//       );
//     }
//   };

// export const createThread = () => async (dispatch: AppDispatch) => {
//   try {
//     dispatch(setProcessingThread());
//     const threadPath = createThreadName();
//     dispatch(setThreadPath(threadPath));
//     dispatch(setProcessing(false));
//   } catch (error) {
//     handleError(error, "Error createThread:", (msg) =>
//       dispatch(setThreadError(msg))
//     );
//   }
// };
