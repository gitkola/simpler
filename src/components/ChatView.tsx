import { useEffect, useRef, useState } from "react";
import { IProjectSettings } from "../types";
import Message from "./Message";
import { ArrowUp } from "./Icons";
import { anthropicModels, openaiModels } from "../configs/aiModels";
import { RootState, useAppDispatch, useAppSelector } from "../store";
import { handleNewMessageToAIModel, saveProjectSettings } from "../store/currentProjectSlice";
import { Select } from "./Select";

export const ChatView: React.FC = () => {
  const messages = useAppSelector((state: RootState) => state.currentProject.currentProjectMessages);
  const settings = useAppSelector((state: RootState) => state.currentProject.currentProjectSettings);
  const aiModelRequestInProgress = useAppSelector((state: RootState) => state.currentProject.aiModelRequestInProgress);
  const aiModelRequestError = useAppSelector((state: RootState) => state.currentProject.aiModelRequestError);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [inputMessage, setInputMessage] = useState("");
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const dispatch = useAppDispatch();

  useEffect(scrollToBottom, [messages?.length]);

  const handleServiceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const service = e.target.value as "openai" | "anthropic";
    if (service === settings?.service) return;
    const model = service === "openai" ? openaiModels[0] : anthropicModels[0];
    const newSettings = { ...settings, service, model };
    await dispatch(saveProjectSettings(newSettings as IProjectSettings));
  };

  const handleModelChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const model = e.target.value;
    if (model === settings?.model) return;
    const newSettings = { ...settings, model };
    await dispatch(saveProjectSettings(newSettings as IProjectSettings));
  };

  const handleSendMessage = async () => {
    await dispatch(handleNewMessageToAIModel(inputMessage, "user"));
    setInputMessage("");
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 overflow-y-auto p-2 pl-2 pt-0 space-y-2 no-scrollbar bg-gray-800">
        <div className="flex-grow h-full overflow-y-auto px-2 pt-2 space-y-2 rounded-md no-scrollbar bg-white">
          {messages?.map((message) => (
            <Message
              key={message.createdAt}
              message={message}
            />
          ))}
          {aiModelRequestInProgress && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-800 px-2 py-2 rounded-md">
                Requesting AI model API...
              </div>
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
      <div className="px-2 bg-gray-800">
        <div className="flex items-end space-x-2">
          <textarea
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="flex-grow p-1 rounded-md hover:ring-2 hover:ring-gray-300 focus:shadow-md focus:ring-2 focus:ring-gray-300 resize-none overflow-y-scroll no-scrollbar"
            placeholder="Type your message... (Shift+Enter for new line)"
            disabled={aiModelRequestInProgress}
            rows={3}
            style={{ minHeight: "2.5rem", maxHeight: "10rem" }}
          />
          <button
            onClick={handleSendMessage}
            className="w-10 h-10 bg-blue-500 text-white rounded-full hover:bg-blue-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center justify-center"
            disabled={aiModelRequestInProgress}
          >
            <ArrowUp size={20} />
          </button>
        </div>
        <div className="flex my-2 space-x-2">
          <Select
            name="service"
            value={settings?.service}
            options={["openai", "anthropic"]}
            onChange={(e) => handleServiceChange(e)}
          />
          <Select
            name="model"
            value={settings?.model}
            options={settings?.service === 'openai' ? openaiModels : anthropicModels}
            onChange={(e) => handleModelChange(e)}
          />
        </div>
      </div>
    </div>
  );
};