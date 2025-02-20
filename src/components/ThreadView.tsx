import { useEffect, useRef } from "react";
import { IProjectSettings } from "../types";
import { ArrowUp, Messages } from "./Icons";
import { anthropicModels, openaiModels } from "../configs/aiModels";
import { RootState, useAppDispatch, useAppSelector } from "../store";
import { saveProjectSettings } from "../store/currentProjectSlice";
import { Select } from "./Select";
import Spinner from "./Spinner";
// import { MESSAGE_TO_AI_MODEL_GENERATE_PROJECT_FILES_REQUEST, MESSAGE_TO_AI_MODEL_GENERATE_PROJECT_TASKS_REQUEST } from "../configs/instructions";
import { textInput } from "../styles/styles";
import ProcessIndicator from "./ProcessIndicator";
import { setInputValue } from "../store/chatSlice";
// import { setInstructionsInContext, setProjectDescriptionsInContext, setProjectFilePathsInContext, setProjectRequirementsInContext, setProjectTasksInContext } from "../store/contextSlice";
// import { FileListButton } from "./FileListButton";
import { handleSendMessage, Message } from "../store/threadSlice";
import Accordion from "./Accordion";
import Editor from "./Editor";

const ThreadMessage: React.FC<{ message: Message }> = ({ message }) => {

  const renderToolCall = (tool_call: any) => {
    const { id, function: func } = tool_call;
    const { name, arguments: args } = func;

    switch (name) {
      case "responseWithCode":
        const { code, language, path } = JSON.parse(args);
        return (
          <div key={id} className="flex flex-col p-2 bg-opacity-50 bg-green-700 text-white rounded-md">
            <div>Function: {name}</div>
            <Editor
              value={code}
              language={language}
              minHeight={24}
              style={{
                lineHeight: 1.6,
              }}
              disabled={true}
            />
            <span>Path: {path}</span>
          </div>
        );
      default:
        return (
          <div key={id} className="flex flex-col p-2 bg-opacity-50 bg-green-700 text-white rounded-md">
            <div>Function: {name}</div>
            <div>Arguments: {args}</div>
          </div>
        );
    };
  };

  // return (
  //   <div key={id} className="flex flex-col p-2 bg-opacity-50 bg-green-700 text-white rounded-md">
  //     <div>Function: {name}</div>
  //     {name === 'responseWithCode' ? <div>
  //       <Editor
  //         value={code}
  //         language={language}
  //         minHeight={24}
  //         style={{
  //           lineHeight: 1.6,
  //         }}
  //         disabled={true}
  //       />
  //       <p>Path: {path}</p>
  //     </div> : <div>Arguments: {args}</div>}
  //   </div>
  // )


  return (
    <div className={`flex flex-col p-2 ${message.role === 'user' ? 'bg-opacity-50 bg-blue-600 ml-64' : message.role === 'system' ? 'bg-opacity-50 bg-gray-600 mx-64' : message.role === 'assistant' ? 'bg-opacity-50 bg-green-600 mr-64' : 'bg-opacity-50 bg-orange-600 mx-64'} text-white rounded-md`}>
      <div className="flex items-center justify-between">
        <div className="text-lg font-extrabold">{message.role}</div>
      </div>
      <div>{message.role !== 'system' ? message.content : ''}</div>
      <div className="space-y-2">
        {
          message?.tool_calls?.map((tool_call) => {
            return renderToolCall(tool_call);
            // const { id, function: func } = tool_call;
            // const { name, arguments: args } = func;
            // const { code, language, path } = JSON.parse(args);

            // return (
            //   <div key={id} className="flex flex-col p-2 bg-opacity-50 bg-green-700 text-white rounded-md">
            //     <div>Function: {name}</div>
            //     {name === 'responseWithCode' ? <div>
            //       <Editor
            //         value={code}
            //         language={language}
            //         minHeight={24}
            //         style={{
            //           lineHeight: 1.6,
            //         }}
            //         disabled={true}
            //       />
            //       <p>Path: {path}</p>
            //     </div> : <div>Arguments: {args}</div>}
            //   </div>
            // )
          })
        }
      </div>
      {message.role === 'system' && <Accordion
        title="Raw message"
        titleClassName="text-xs"
        content={
          <div
            style={{ whiteSpace: 'pre-wrap' }}
            className="text-xs"
          >
            {JSON.stringify(message, null, 2)}
          </div>
        }
      />}
    </div>
  );
};

export const ThreadView: React.FC = () => {
  const {
    currentProjectSettings,
    isLoadingCurrentProjectSettings,
    currentProjectSettingsError,
  } = useAppSelector((state: RootState) => state.currentProject);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { inputValue } = useAppSelector((state: RootState) => state.chat);
  // const { instructionsInContext, projectDescriptionsInContext, projectRequirementsInContext, projectTasksInContext, projectFilePathsInContext } = useAppSelector((state: RootState) => state.context);
  const { isLoading, messages, error } = useAppSelector((state: RootState) => state.thread);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const dispatch = useAppDispatch();

  useEffect(() => {
    setTimeout(scrollToBottom, 10);
  }, [messages?.length]);

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
    dispatch(setInputValue(""));
    dispatch(handleSendMessage(content));
  };

  console.log(messages);


  return (
    <div className="flex flex-col border-r border-0.5 min-w-[900px] max-w-[1200px]">
      <div className="flex p-2 space-x-2 items-center justify-start border-b border-0.5">
        <Messages className="w-8 h-8" />
        <h2 className="text-lg font-semibold">AI Thread</h2>
      </div>
      <div className="flex-1 flex flex-col justify-between overflow-hidden">
        {/* {isLoading && <ProcessIndicator />}
        {error && <div className="flex p-4 items-center justify-center bg-opacity-50 bg-red-600">{error}</div>} */}
        <div className="flex-1 overflow-y-scroll">
          <div className="pl-2 pt-2 pr-0.5 space-y-2 h-fit">
            {messages?.map((message, index) => (
              <ThreadMessage
                key={index}
                message={message}
              />
            ))}
            {isLoading && (
              <div className="flex justify-center items-center">
                <Spinner color="white" />
              </div>
            )}
            {error && (
              <div className="flex justify-center">
                <div className="bg-opacity-50 bg-red-100 text-red-600 px-2 py-2 rounded-md">
                  {error}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <div id="input_section" className="flex-wrap p-2 border-t border-0.5 overflow-y-hidden">
          <div className="flex flex-col gap-2">
            {/* <div className="flex flex-wrap gap-2 items-center">
              <div>Suggestions:</div>
              <button
                onClick={async () => await dispatch(handleSendMessage(MESSAGE_TO_AI_MODEL_GENERATE_PROJECT_TASKS_REQUEST))}
                className={`${outlineButtonBlue}`}
                disabled={isLoading}
              >
                <div>Generate Tasks</div>
                <ArrowUp size={20} />
              </button>
              <button
                onClick={async () => await dispatch(handleSendMessage(MESSAGE_TO_AI_MODEL_GENERATE_PROJECT_FILES_REQUEST))}
                className={`${outlineButtonBlue}`}
                disabled={isLoading}
              >
                <div>Generate File Structure</div>
                <ArrowUp size={20} />
              </button>
            </div> */}
            {/* <div className="flex flex-wrap gap-2 items-center">
              <div>Context:</div>
              <label className={`${outlineButtonBlue}`}>
                <input
                  type="checkbox"
                  checked={instructionsInContext}
                  onChange={(e) => dispatch(setInstructionsInContext(e.target.checked))}
                  className="h-4 w-4 mr-2"
                />
                Instructions
              </label>
              <label className={`${outlineButtonBlue}`}>
                <input
                  type="checkbox"
                  checked={projectDescriptionsInContext}
                  onChange={(e) => dispatch(setProjectDescriptionsInContext(e.target.checked))}
                  className="h-4 w-4 mr-2"
                />
                Description
              </label>
              <label className={`${outlineButtonBlue}`}>
                <input
                  type="checkbox"
                  checked={projectRequirementsInContext}
                  onChange={(e) => dispatch(setProjectRequirementsInContext(e.target.checked))}
                  className="h-4 w-4 mr-2"
                />
                Requirements
              </label>
              <label className={`${outlineButtonBlue}`}>
                <input
                  type="checkbox"
                  checked={projectTasksInContext}
                  onChange={(e) => dispatch(setProjectTasksInContext(e.target.checked))}
                  className="h-4 w-4 mr-2"
                />
                Tasks
              </label>
              <label className={`${outlineButtonBlue}`}>
                <input
                  type="checkbox"
                  checked={projectFilePathsInContext}
                  onChange={(e) => dispatch(setProjectFilePathsInContext(e.target.checked))}
                  className="h-4 w-4 mr-2"
                />
                File Paths
              </label>
              <FileListButton />
            </div> */}
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
                disabled={isLoading}
                rows={10}
              />
              <button
                onClick={handleNewMessage}
                className="flex w-10 h-10 min-w-10 bg-opacity-50 bg-blue-600 text-white rounded-full hover:relative hover:bg-opacity-50 hover:shadow-md focus:outline-none disabled:opacity-50 items-center justify-center"
                disabled={isLoading || !inputValue}
              >
                {
                  isLoading ? (<Spinner size="sm" color="white" />) : (<ArrowUp size={24} />)
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