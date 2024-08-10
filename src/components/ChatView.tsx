import { useEffect, useRef } from "react";
import { IProjectSettings } from "../types";
import Message from "./Messages/Message";
import { ArrowUp, Brain } from "./Icons";
import { anthropicModels, openaiModels } from "../configs/aiModels";
import { RootState, useAppDispatch, useAppSelector } from "../store";
import { saveProjectSettings, handleSendMessage } from "../store/currentProjectSlice";
import { Select } from "./Select";
import Spinner from "./Spinner";
import { MESSAGE_TO_AI_MODEL_GENERATE_PROJECT_FILES_REQUEST, MESSAGE_TO_AI_MODEL_GENERATE_PROJECT_TASKS_REQUEST } from "../configs/instructions";
import { outlineButton, textInput } from "../styles/styles";
import ProcessIndicator from "./ProcessIndicator";
import createBaseMessage from "../utils/createBaseMessage";
import { setInputValue } from "../store/chatSlice";

export const ChatView: React.FC = () => {
  const { currentProjectMessages,
    isLoadingCurrentProjectMessages,
    currentProjectMessagesError,
    currentProjectSettings,
    isLoadingCurrentProjectSettings,
    currentProjectSettingsError,
    aiModelRequestInProgress,
    aiModelRequestError,
  } = useAppSelector((state: RootState) => state.currentProject);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { inputValue } = useAppSelector((state: RootState) => state.chat);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const dispatch = useAppDispatch();

  useEffect(() => {
    setTimeout(scrollToBottom, 10);
  }, [currentProjectMessages?.length]);

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
    await dispatch(handleSendMessage(message));
  };

  return (
    <div className="flex flex-col h-screen border-r border-0.5 min-w-[900px] overflow-x-scroll">
      <div className="flex p-2 space-x-2 items-center justify-start border-b border-0.5">
        <Brain className="w-8 h-8" />
        <h2 className="text-lg font-semibold">AI Chat</h2>
      </div>
      {isLoadingCurrentProjectMessages && <ProcessIndicator />}
      {currentProjectMessagesError && <div>{currentProjectMessagesError}</div>}
      <div className="flex flex-col h-full overflow-scroll">
        <div className="p-2 h-fit space-y-8">
          {currentProjectMessages?.map((message) => (
            <Message
              key={message.id}
              message={message}
            />
          ))}
          {aiModelRequestInProgress && (
            <div className="flex justify-center items-center">
              <Spinner color="white" />
            </div>
          )}
          {aiModelRequestError && (
            <div className="flex justify-center">
              <div className="bg-red-100 text-red-800 px-2 py-2 rounded-md">
                {aiModelRequestError}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="px-2 border-t border-0.5">
        <div className="flex py-2 space-x-2 items-center">
          <div>Suggestions:</div>
          <button
            onClick={async () => await dispatch(handleSendMessage(createBaseMessage(MESSAGE_TO_AI_MODEL_GENERATE_PROJECT_TASKS_REQUEST, "user")))}
            className={`${outlineButton}`}
            disabled={aiModelRequestInProgress}
          >
            <div>Generate Tasks</div>
            <ArrowUp size={20} />
          </button>
          <button
            onClick={async () => await dispatch(handleSendMessage(createBaseMessage(MESSAGE_TO_AI_MODEL_GENERATE_PROJECT_FILES_REQUEST, "user")))}
            className={`${outlineButton}`}
            disabled={aiModelRequestInProgress}
          >
            <div>Generate File Structure</div>
            <ArrowUp size={20} />
          </button>
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
            rows={10}
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
        <div className="flex flex-col space-y-2">
          {isLoadingCurrentProjectSettings && <ProcessIndicator />}
          {currentProjectSettingsError && <div>{currentProjectSettingsError}</div>}
          {
            (!isLoadingCurrentProjectSettings && currentProjectSettings?.service) &&
            <div className="flex my-2 space-x-2">
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
  );
};