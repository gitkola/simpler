import React from "react";
import { useAppSelector, useAppDispatch } from "../store";
import { RootState } from "../store";
import { resetToDefaultInstructions, setApiKey, setProjectStateInstructions, setResponseGuidelinesInstructions, setResponsibilitiesInstructions } from "../store/settingsSlice";

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
    <div className="flex flex-col h-full p-2 pt-0 bg-gray-800  no-scrollbar">
      <div className="flex flex-col h-full rounded-md overflow-auto bg-white  no-scrollbar">
        <div className="p-2">
          <dl className="space-y-6">
            <div>
              <dt className="text-sm font-medium text-gray-500">OpenAI API Key</dt>
              <dd className="mt-1">
                <input
                  type="password"
                  value={settings.apiKeys.openai}
                  onChange={(e) => handleApiKeyChange("openai", e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your OpenAI API key"
                />
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Anthropic API Key</dt>
              <dd className="mt-1">
                <input
                  type="password"
                  value={settings.apiKeys.anthropic}
                  onChange={(e) => handleApiKeyChange("anthropic", e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your Anthropic API key"
                />
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">AI Responsibilities Instructions</dt>
              <dd className="mt-1">
                <textarea
                  value={settings?.instructions?.responsibilitiesInstructions}
                  onChange={(e) => handleResponsibilitiesInstructionsChange(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm no-scrollbar"
                  placeholder="Enter AI Responsibilities Instructions"
                  rows={8}
                />
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">AI Project State Instructions</dt>
              <dd className="mt-1">
                <textarea
                  value={settings?.instructions?.projectStateInstructions}
                  onChange={(e) => handleProjectStateInstructionsChange(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm no-scrollbar"
                  placeholder="Enter AI Project State Instructions"
                  rows={8}
                />
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">AI Response Guidelines Instructions</dt>
              <dd className="mt-1">
                <textarea
                  value={settings?.instructions?.responseGuidelinesInstructions}
                  onChange={(e) => handleResponseGuidelinesInstructionsChange(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm no-scrollbar"
                  placeholder="Enter AI Response Guidelines Instructions"
                  rows={8}
                />
              </dd>
            </div>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md text-sm mr-2 hover:shadow-md"
              onClick={() => dispatch(resetToDefaultInstructions())}
            >
              Reset To Default Instructions
            </button>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default Settings;