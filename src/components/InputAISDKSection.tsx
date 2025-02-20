import React, { useRef } from "react";
import { RootState, useAppDispatch, useAppSelector } from "../store";
import { ArrowUp } from "./Icons";
import { anthropicModels, openaiModels } from "../configs/aiModels";
import { saveProjectSettings } from "../store/currentProjectSlice";
import { Select } from "./Select";
import Spinner from "./Spinner";
import { MESSAGE_TO_AI_MODEL_GENERATE_PROJECT_FILES_REQUEST, MESSAGE_TO_AI_MODEL_GENERATE_PROJECT_TASKS_REQUEST } from "../configs/instructions";
import { outlineButtonBlue, textInput } from "../styles/styles";
import ProcessIndicator from "./ProcessIndicator";
import createBaseMessage from "@/lib/utils/createBaseMessage";
import { appendToInputValue, setInputValue } from "../store/chatSlice";
import {
    setUseSystemMessage,
    setInstructionsInContext,
    setProjectDescriptionsInContext,
    setProjectFilePathsInContext,
    setProjectRequirementsInContext,
    setProjectTasksInContext
} from "../store/contextSlice";
import { FileListButton } from "./FileListButton";
import { Message } from "ai";
import { IProjectSettings } from "../types";
import RenderCounter from "./RenderCounter";
import { readFile, selectFile } from "../services/fsService";
import { handleSendMessageWithAISDK } from "../store/handleSendMessageWithAISDK";
import { useChat } from "ai/react";

const InputAISDKSection: React.FC = () => {
    const {
        currentProjectSettings,
        isLoadingCurrentProjectSettings,
        currentProjectSettingsError,
        aiModelRequestInProgress,
    } = useAppSelector((state: RootState) => state.currentProject);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    // const { inputValue } = useAppSelector((state: RootState) => state.chat);
    const context = useAppSelector((state: RootState) => state.context);
    // const activeProjectPath = useAppSelector((state) => state.projects.activeProjectPath);
    const { useSystemMessage, instructionsInContext, projectDescriptionsInContext, projectRequirementsInContext, projectTasksInContext, projectFilePathsInContext } = context;
    const dispatch = useAppDispatch();

    const { messages, input, setInput, append, isLoading } = useChat({
        api: "/api/chat",
    })

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

    // const handleNewMessage = async () => {
    //     const content = inputValue.trim();
    //     if (!content) return;
    //     const message = createBaseMessage(content, "user");
    //     dispatch(setInputValue(""));
    //     await dispatch(handleSendMessageWithAISDK(message as Message));
    // };

    const handleNewMessage = async () => {
        const content = input.trim();
        if (!content) return;
        const message = createBaseMessage(content, "user");
        setInput("");
        await dispatch(handleSendMessageWithAISDK(message as Message));
    };

    return (
        <div className="flex flex-col">
            {isLoadingCurrentProjectSettings && <ProcessIndicator />}
            <div id="input_section" className="flex-wrap p-2 border-t border-0.5 overflow-y-hidden">
                <RenderCounter name="InputAISDKSection" />
                <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap gap-2 items-center">
                        <div>Suggestions:</div>
                        <button
                            onClick={async () => dispatch(appendToInputValue(MESSAGE_TO_AI_MODEL_GENERATE_PROJECT_TASKS_REQUEST))}
                            className={`${outlineButtonBlue}`}
                            disabled={aiModelRequestInProgress}
                        >
                            <div>Generate Tasks</div>
                        </button>
                        <button
                            onClick={async () => dispatch(appendToInputValue(MESSAGE_TO_AI_MODEL_GENERATE_PROJECT_FILES_REQUEST))}
                            className={`${outlineButtonBlue}`}
                            disabled={aiModelRequestInProgress}
                        >
                            <div>Generate File Structure</div>
                        </button>
                        <button
                            onClick={async () => {
                                const path = await selectFile();
                                if (!path) return;
                                const content = await readFile(path);
                                if (!content) return;
                                dispatch(appendToInputValue(content));
                            }}
                            className={`${outlineButtonBlue}`}
                            disabled={aiModelRequestInProgress}
                        >
                            <div>Load Prompt File</div>
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2 items-center">
                        <div>Context:</div>
                        <label className={`${outlineButtonBlue}`}>
                            <input
                                type="checkbox"
                                checked={useSystemMessage}
                                onChange={(e) => dispatch(setUseSystemMessage(e.target.checked))}
                                className="h-4 w-4 mr-2"
                            />
                            Use System Message
                        </label>
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
                    </div>
                    <div className="flex items-end space-x-2">
                        <textarea
                            autoCapitalize="off"
                            autoComplete="off"
                            autoSave="off"
                            spellCheck={false}
                            ref={inputRef}
                            value={input}
                            // value={inputValue}
                            onChange={(e) => dispatch(setInputValue(e.target.value))}
                            onKeyPress={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleNewMessage();
                                }
                            }}
                            className={`${textInput}`}
                            placeholder="Type your message... (Shift+Enter for new line)"
                            // disabled={aiModelRequestInProgress}
                            disabled={isLoading}
                            rows={4}
                        />
                        <button
                            onClick={handleNewMessage}
                            className="flex w-10 h-10 min-w-10 bg-blue-500 text-white rounded-full hover:relative hover:bg-blue-600 hover:shadow-md focus:outline-none disabled:opacity-50 items-center justify-center"
                            // disabled={aiModelRequestInProgress || !inputValue}
                            disabled={isLoading || !input}
                        >
                            {
                                aiModelRequestInProgress ? (<Spinner size="sm" color="white" />) : (<ArrowUp size={24} />)
                            }
                        </button>
                    </div>
                    <div className="flex flex-col">
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
    );
};

export default InputAISDKSection;