import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { setApiKey } from "../store/settingsSlice";

const Settings: React.FC = () => {
  const settings = useSelector((state: RootState) => state.settings);
  const dispatch = useDispatch();

  const handleApiKeyChange = (service: "openai" | "anthropic", key: string) => {
    dispatch(setApiKey({ service, key }));
  };

  return (
    <div>
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Settings</h3>
      </div>

      <div className="px-4 py-5 sm:p-6">
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
        </dl>
      </div>
    </div>
  );
};

export default Settings;