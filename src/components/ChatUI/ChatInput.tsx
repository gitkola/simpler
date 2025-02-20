import { useCallback } from "react";
import { IProjectSettings } from "@/types";
import { ArrowUp } from "../Icons";
import { anthropicModels, openaiModels } from "@/configs/aiModels";
import { Select } from "../Select";
import Spinner from "../Spinner";
import { MESSAGE_TO_AI_MODEL_GENERATE_PROJECT_FILES_REQUEST, MESSAGE_TO_AI_MODEL_GENERATE_PROJECT_TASKS_REQUEST } from "../../configs/instructions";
import { outlineButtonBlue, textInput } from "@/styles/styles";
import ProcessIndicator from "../ProcessIndicator";
import { FileListButton } from "../FileListButton";
import { debounce } from "@/lib/utils/debounce";

interface ChatInputProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  isLoading: boolean;
  currentProjectSettings?: IProjectSettings;
  isLoadingSettings: boolean;
  settingsError?: string;
  onServiceChange: (service: "openai" | "anthropic") => void;
  onModelChange: (model: string) => void;
  onAppendToInput: (text: string) => void;
  contextSettings: {
    instructions: boolean;
    descriptions: boolean;
    requirements: boolean;
    tasks: boolean;
    filePaths: boolean;
  };
  onContextChange: (key: 'instructions' | 'descriptions' | 'requirements' | 'tasks' | 'filePaths', value: boolean) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  inputValue,
  onInputChange,
  onSendMessage,
  isLoading,
  currentProjectSettings,
  isLoadingSettings,
  settingsError,
  onServiceChange,
  onModelChange,
  onAppendToInput,
  contextSettings,
  onContextChange,
}) => {
  const debouncedSetContext = useCallback(
    debounce((key: string, value: boolean) => onContextChange(key as any, value), 300),
    []
  );

  return (
    <div className="flex-wrap p-2 border-t border-0.5 overflow-y-hidden">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-2 items-center">
          <div>Suggestions:</div>
          <button
            onClick={() => onAppendToInput(MESSAGE_TO_AI_MODEL_GENERATE_PROJECT_TASKS_REQUEST)}
            className={outlineButtonBlue}
            disabled={isLoading}
          >
            <div>Generate Tasks</div>
          </button>
          <button
            onClick={() => onAppendToInput(MESSAGE_TO_AI_MODEL_GENERATE_PROJECT_FILES_REQUEST)}
            className={outlineButtonBlue}
            disabled={isLoading}
          >
            <div>Generate File Structure</div>
          </button>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <div>Context:</div>
          {Object.entries(contextSettings).map(([key, value]) => (
            <label key={key} className={outlineButtonBlue}>
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => debouncedSetContext(key, e.target.checked)}
                className="h-4 w-4 mr-2"
              />
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </label>
          ))}
          <FileListButton />
        </div>
        <div className="flex items-end space-x-2">
          <textarea
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
            autoSave="off"
            spellCheck={false}
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSendMessage();
              }
            }}
            className={textInput}
            placeholder="Type your message... (Shift+Enter for new line)"
            disabled={isLoading}
            rows={4}
          />
          <button
            onClick={onSendMessage}
            className="flex w-10 h-10 min-w-10 bg-blue-500 text-white rounded-full hover:relative hover:bg-blue-600 hover:shadow-md focus:outline-none disabled:opacity-50 items-center justify-center"
            disabled={isLoading || !inputValue}
          >
            {isLoading ? <Spinner size="sm" color="white" /> : <ArrowUp size={24} />}
          </button>
        </div>
        <div className="flex flex-col">
          {isLoadingSettings && <ProcessIndicator />}
          {settingsError && <div>{settingsError}</div>}
          {(!isLoadingSettings && currentProjectSettings?.service) && (
            <div className="flex space-x-2">
              <Select
                name="service"
                value={currentProjectSettings.service}
                options={["openai", "anthropic"]}
                onChange={(e) => onServiceChange(e.target.value as "openai" | "anthropic")}
              />
              <Select
                name="model"
                value={currentProjectSettings.model}
                options={currentProjectSettings.service === 'openai' ? openaiModels : anthropicModels}
                onChange={(e) => onModelChange(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 