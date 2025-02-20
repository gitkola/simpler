import { Brain } from "../Icons";
import { RootState, useAppDispatch, useAppSelector } from "@/store";
import { saveProjectSettings } from "@/store/currentProjectSlice";
import { setInputValue, appendToInputValue } from "@/store/chatSlice";
import { setInstructionsInContext, setProjectDescriptionsInContext, setProjectFilePathsInContext, setProjectRequirementsInContext, setProjectTasksInContext } from "../../store/contextSlice";
import SquareButton from "../SquareButton";
import { setShowChat } from "@/store/layoutSlice";
import { handleSendMessage } from "@/store/handleSendMessage";
import { ChatThread } from "./ChatThread";
import { ChatInput } from "./ChatInput";
import createBaseMessage from "@/lib/utils/createBaseMessage";
import { IProjectSettings } from "@/types";
import { anthropicModels, openaiModels } from "@/configs/aiModels";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { Thread } from "./Thread";

type ContextKey = 'instructions' | 'descriptions' | 'requirements' | 'tasks' | 'filePaths';
type ContextAction = ActionCreatorWithPayload<boolean, string>;
type ContextActions = Record<ContextKey, ContextAction>;

export const ChatView: React.FC = () => {
  const {
    currentProjectMessages,
    isLoadingCurrentProjectMessages,
    currentProjectMessagesError,
    currentProjectSettings,
    isLoadingCurrentProjectSettings,
    currentProjectSettingsError,
    aiModelRequestInProgress,
    aiModelRequestError,
  } = useAppSelector((state: RootState) => state.currentProject);
  const { inputValue } = useAppSelector((state: RootState) => state.chat);
  const {
    instructionsInContext,
    projectDescriptionsInContext,
    projectRequirementsInContext,
    projectTasksInContext,
    projectFilePathsInContext
  } = useAppSelector((state: RootState) => state.context);
  const dispatch = useAppDispatch();

  const handleNewMessage = async () => {
    const content = inputValue.trim();
    if (!content) return;
    const message = createBaseMessage(content, "user");
    dispatch(setInputValue(""));
    await dispatch(handleSendMessage(message));
  };

  const handleServiceChange = async (service: "openai" | "anthropic") => {
    if (service === currentProjectSettings?.service) return;
    const model = service === "openai" ? openaiModels[0] : anthropicModels[0];
    const newSettings = { ...currentProjectSettings, service, model } as IProjectSettings;
    await dispatch(saveProjectSettings(newSettings));
  };

  const handleModelChange = async (model: string) => {
    if (model === currentProjectSettings?.model) return;
    const newSettings = { ...currentProjectSettings, model } as IProjectSettings;
    await dispatch(saveProjectSettings(newSettings));
  };

  const contextActions: ContextActions = {
    instructions: setInstructionsInContext,
    descriptions: setProjectDescriptionsInContext,
    requirements: setProjectRequirementsInContext,
    tasks: setProjectTasksInContext,
    filePaths: setProjectFilePathsInContext,
  };

  return (
    <div className="flex flex-col border-r border-0.5 min-w-[900px] max-w-[1200px]">
      <div className="flex pl-2 space-x-2 items-center justify-between border-b border-0.5">
        <div className="flex items-center space-x-2">
          <Brain className="w-8 h-8" />
          <h2 className="text-lg font-semibold">AI Chat</h2>
        </div>
        <SquareButton icon="close" onClick={() => dispatch(setShowChat(false))} />
      </div>
      <div className="flex-1 flex flex-col justify-between overflow-hidden">
        {/* <ChatThread
          messages={currentProjectMessages || []}
          isLoading={isLoadingCurrentProjectMessages}
          error={currentProjectMessagesError || undefined}
          aiModelRequestInProgress={aiModelRequestInProgress}
          aiModelRequestError={aiModelRequestError || undefined}
        /> */}
        <Thread />
        <ChatInput
          inputValue={inputValue}
          onInputChange={(value) => dispatch(setInputValue(value))}
          onSendMessage={handleNewMessage}
          isLoading={aiModelRequestInProgress}
          currentProjectSettings={currentProjectSettings || undefined}
          isLoadingSettings={isLoadingCurrentProjectSettings}
          settingsError={currentProjectSettingsError || undefined}
          onServiceChange={handleServiceChange}
          onModelChange={handleModelChange}
          onAppendToInput={(text) => dispatch(appendToInputValue(text))}
          contextSettings={{
            instructions: instructionsInContext,
            descriptions: projectDescriptionsInContext,
            requirements: projectRequirementsInContext,
            tasks: projectTasksInContext,
            filePaths: projectFilePathsInContext,
          }}
          onContextChange={(key, value) => {
            dispatch(contextActions[key as ContextKey](value));
          }}
        />
      </div>
    </div>
  );
};