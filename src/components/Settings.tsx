import React from "react";
import { useAppSelector, useAppDispatch } from "../store";
import { RootState } from "../store";
import { resetToDefaultInstructions, setApiKey, setProjectStateInstructions, setResponseGuidelinesInstructions, setResponsibilitiesInstructions } from "../store/settingsSlice";
import { textInput } from "../styles/styles";
import { SettingsIcon } from "./Icons";

const Settings: React.FC = () => {
  const settings = useAppSelector((state: RootState) => state.settings);
  const dispatch = useAppDispatch();

  const handleApiKeyChange = (service: "openai" | "anthropic", key: string) => {
    dispatch(setApiKey({ service, key }));
  };

  const handleResponsibilitiesInstructionsChange = (value: string) => {
    dispatch(setResponsibilitiesInstructions(value));
  };

  const handleResponseGuidelinesInstructionsChange = (value: string) => {
    dispatch(setResponseGuidelinesInstructions(value));
  };

  const handleProjectStateInstructionsChange = (value: string) => {
    dispatch(setProjectStateInstructions(value));
  };

  return (
    <div className="flex flex-col h-screen border-r border-0.5 min-w-[900px] overflow-x-scroll">
      <div className="flex p-2 space-x-2 items-center justify-start border-b border-0.5">
        <SettingsIcon className="w-8 h-8" />
        <h2 className="text-lg font-semibold">Settings</h2>
      </div>
      <div className="flex flex-col h-full overflow-auto">
        <div className="p-2">
          <dl className="space-y-6">
            <div>
              <dt className="font-medium">OpenAI API Key</dt>
              <dd className="mt-1">
                <input
                  type="password"
                  value={settings.apiKeys.openai}
                  onChange={(e) => handleApiKeyChange("openai", e.target.value)}
                  className={`${textInput}`}
                  placeholder="Enter your OpenAI API key"
                />
              </dd>
            </div>
            <div>
              <dt className="font-medium">Anthropic API Key</dt>
              <dd className="mt-1">
                <input
                  type="password"
                  value={settings.apiKeys.anthropic}
                  onChange={(e) => handleApiKeyChange("anthropic", e.target.value)}
                  className={`${textInput}`}
                  placeholder="Enter your Anthropic API key"
                />
              </dd>
            </div>
            <div>
              <dt className="font-medium">AI Responsibilities Instructions</dt>
              <dd className="mt-1">
                <textarea
                  autoCapitalize="off"
                  autoCorrect="off"
                  autoComplete="off"
                  autoSave="off"
                  spellCheck={false}
                  value={settings?.instructions?.responsibilitiesInstructions}
                  onChange={(e) => handleResponsibilitiesInstructionsChange(e.target.value)}
                  className={`${textInput}`}
                  placeholder="Enter AI Responsibilities Instructions"
                  rows={8}
                />
              </dd>
            </div>
            <div>
              <dt className="font-medium">AI Project State Instructions</dt>
              <dd className="mt-1">
                <textarea
                  autoCapitalize="off"
                  autoCorrect="off"
                  autoComplete="off"
                  autoSave="off"
                  spellCheck={false}
                  value={settings?.instructions?.projectStateInstructions}
                  onChange={(e) => handleProjectStateInstructionsChange(e.target.value)}
                  className={`${textInput}`}
                  placeholder="Enter AI Project State Instructions"
                  rows={8}
                />
              </dd>
            </div>
            <div>
              <dt className="font-medium">AI Response Guidelines Instructions</dt>
              <dd className="mt-1">
                <textarea
                  autoCapitalize="off"
                  autoCorrect="off"
                  autoComplete="off"
                  autoSave="off"
                  spellCheck={false}
                  value={settings?.instructions?.responseGuidelinesInstructions}
                  onChange={(e) => handleResponseGuidelinesInstructionsChange(e.target.value)}
                  className={`${textInput}`}
                  placeholder="Enter AI Response Guidelines Instructions"
                  rows={8}
                />
              </dd>
            </div>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-md text-sm mr-2 hover:shadow-md"
              onClick={() => dispatch(resetToDefaultInstructions())}
            >
              Reset To Default Instructions
            </button>
          </dl>
        </div>
        {/* <AllIcons /> */}
      </div>
    </div>
  );
};

export default Settings;