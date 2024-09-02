import { useEffect, useMemo, useRef } from "react";
import { IMessage, IProjectSettings } from "../types";
import Message from "./Messages/Message";
import { ArrowUp, Brain } from "./Icons";
import { anthropicModels, openaiModels } from "../configs/aiModels";
import { RootState, useAppDispatch, useAppSelector } from "../store";
import { saveProjectSettings, handleSendMessageWithAISDK, createSystemPrompt } from "../store/currentProjectSlice";
import { Select } from "./Select";
import Spinner from "./Spinner";
import { MESSAGE_TO_AI_MODEL_GENERATE_PROJECT_FILES_REQUEST, MESSAGE_TO_AI_MODEL_GENERATE_PROJECT_TASKS_REQUEST } from "../configs/instructions";
import { outlineButton, textInput } from "../styles/styles";
import ProcessIndicator from "./ProcessIndicator";
import createBaseMessage from "../utils/createBaseMessage";
import { setInputValue } from "../store/chatSlice";
import { setInstructionsInContext, setProjectDescriptionsInContext, setProjectFilePathsInContext, setProjectRequirementsInContext, setProjectTasksInContext } from "../store/contextSlice";
import { FileListButton } from "./FileListButton";
import { CoreMessage, CoreUserMessage } from "ai";


export const ChatViewAISDK: React.FC = () => {
  const {
    currentProjectState,
    currentProjectConversation,
    isLoadingCurrentProjectConversation,
    currentProjectConversationError,
    currentProjectSettings,
    isLoadingCurrentProjectSettings,
    currentProjectSettingsError,
    aiModelRequestInProgress,
    aiModelRequestError,
  } = useAppSelector((state: RootState) => state.currentProject);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { inputValue } = useAppSelector((state: RootState) => state.chat);
  const { generalInstructions } = useAppSelector((state: RootState) => state.settings.instructions);
  const context = useAppSelector((state: RootState) => state.context);
  const { instructionsInContext, projectDescriptionsInContext, projectRequirementsInContext, projectTasksInContext, projectFilePathsInContext } = context;
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const dispatch = useAppDispatch();

  useEffect(() => {
    setTimeout(scrollToBottom, 10);
  }, [currentProjectConversation?.length]);

  const handleServiceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const service = e.target.value as "openai" | "anthropic";
    if (service === currentProjectSettings?.service) return;
    const model = service === "openai" ? openaiModels[0] : anthropicModels[0];
    const newSettings = { ...currentProjectSettings, service, model };
    await dispatch(saveProjectSettings(newSettings as IProjectSettings));
  };

  const handleModelChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const model = e.target.value;
    if (model === currentProjectSettings?.model) return;
    const newSettings = { ...currentProjectSettings, model };
    await dispatch(saveProjectSettings(newSettings as IProjectSettings));
  };

  const handleNewMessage = async () => {
    const content = inputValue.trim();
    if (!content) return;
    const message = createBaseMessage(content, "user");
    dispatch(setInputValue(""));
    await dispatch(handleSendMessageWithAISDK(message as CoreMessage));
  };

  const systemPrompt = useMemo(() => createSystemPrompt(context, generalInstructions, currentProjectState), [context,]);

  return (
    <div className="flex flex-col border-r border-0.5 min-w-[900px] max-w-[1200px]">
      <div className="flex p-2 space-x-2 items-center justify-start border-b border-0.5">
        <Brain className="w-8 h-8" />
        <h2 className="text-lg font-semibold">AI Chat Vercel SDK</h2>
      </div>
      <div className="flex-1 flex flex-col justify-between overflow-hidden">
        {isLoadingCurrentProjectConversation && <ProcessIndicator />}
        {currentProjectConversationError && <div className="flex p-4 items-center justify-center bg-red-500">{currentProjectConversationError}</div>}
        <div className="flex-1 overflow-x-auto overflow-y-scroll">
          <div className="pl-2 pt-2 pr-0.5 space-y-2 h-fit">
            <Message message={{ role: "system", content: systemPrompt }} />
            {currentProjectConversation?.map((message, index) => (
              <Message
                key={index}
                message={message as IMessage}
              />
            ))}
            {aiModelRequestInProgress && (
              <div className="flex justify-center items-center">
                <Spinner color="white" />
              </div>
            )}
            {aiModelRequestError && (
              <div className="flex-wrap justify-center">
                <div className="bg-red-100 text-red-800 px-2 py-2 rounded-md">
                  {aiModelRequestError}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <div id="input_section" className="flex-wrap p-2 border-t border-0.5 overflow-y-hidden">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-2 items-center">
              <div>Suggestions:</div>
              <button
                onClick={async () => await dispatch(handleSendMessageWithAISDK(createBaseMessage(MESSAGE_TO_AI_MODEL_GENERATE_PROJECT_TASKS_REQUEST, "user") as CoreUserMessage))}
                className={`${outlineButton}`}
                disabled={aiModelRequestInProgress}
              >
                <div>Generate Tasks</div>
                <ArrowUp size={20} />
              </button>
              <button
                onClick={async () => await dispatch(handleSendMessageWithAISDK(createBaseMessage(MESSAGE_TO_AI_MODEL_GENERATE_PROJECT_FILES_REQUEST, "user") as CoreUserMessage))}
                className={`${outlineButton}`}
                disabled={aiModelRequestInProgress}
              >
                <div>Generate File Structure</div>
                <ArrowUp size={20} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <div>Context:</div>
              <label className={`${outlineButton}`}>
                <input
                  type="checkbox"
                  checked={instructionsInContext}
                  onChange={(e) => dispatch(setInstructionsInContext(e.target.checked))}
                  className="h-4 w-4 mr-2"
                />
                Instructions
              </label>
              <label className={`${outlineButton}`}>
                <input
                  type="checkbox"
                  checked={projectDescriptionsInContext}
                  onChange={(e) => dispatch(setProjectDescriptionsInContext(e.target.checked))}
                  className="h-4 w-4 mr-2"
                />
                Description
              </label>
              <label className={`${outlineButton}`}>
                <input
                  type="checkbox"
                  checked={projectRequirementsInContext}
                  onChange={(e) => dispatch(setProjectRequirementsInContext(e.target.checked))}
                  className="h-4 w-4 mr-2"
                />
                Requirements
              </label>
              <label className={`${outlineButton}`}>
                <input
                  type="checkbox"
                  checked={projectTasksInContext}
                  onChange={(e) => dispatch(setProjectTasksInContext(e.target.checked))}
                  className="h-4 w-4 mr-2"
                />
                Tasks
              </label>
              <label className={`${outlineButton}`}>
                <input
                  type="checkbox"
                  checked={projectFilePathsInContext}
                  onChange={(e) => dispatch(setProjectFilePathsInContext(e.target.checked))}
                  className="h-4 w-4 mr-2"
                />
                File Paths
              </label>
              <FileListButton />
            </div>
            <div className="flex items-end space-x-2">
              <textarea
                autoCapitalize="off"
                autoCorrect="off"
                autoComplete="off"
                autoSave="off"
                spellCheck={false}
                ref={inputRef}
                value={inputValue}
                onChange={(e) => dispatch(setInputValue(e.target.value))}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleNewMessage();
                  }
                }}
                className={`${textInput}`}
                placeholder="Type your message... (Shift+Enter for new line)"
                disabled={aiModelRequestInProgress}
                rows={4}
              />
              <button
                onClick={handleNewMessage}
                className="flex w-10 h-10 min-w-10 bg-blue-500 text-white rounded-full hover:relative hover:bg-blue-600 hover:shadow-md focus:outline-none disabled:opacity-50 items-center justify-center"
                disabled={aiModelRequestInProgress || !inputValue}
              >
                {
                  aiModelRequestInProgress ? (<Spinner size="sm" color="white" />) : (<ArrowUp size={24} />)
                }
              </button>
            </div>
            <div className="flex flex-col">
              {isLoadingCurrentProjectSettings && <ProcessIndicator />}
              {currentProjectSettingsError && <div>{currentProjectSettingsError}</div>}
              {
                (!isLoadingCurrentProjectSettings && currentProjectSettings?.service) &&
                <div className="flex space-x-2">
                  <Select
                    name="service"
                    value={currentProjectSettings?.service}
                    options={["openai", "anthropic"]}
                    onChange={(e) => handleServiceChange(e)}
                  />
                  <Select
                    name="model"
                    value={currentProjectSettings?.model}
                    options={currentProjectSettings?.service === 'openai' ? openaiModels : anthropicModels}
                    onChange={(e) => handleModelChange(e)}
                  />
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};