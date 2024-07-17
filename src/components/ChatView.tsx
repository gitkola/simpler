import { useEffect, useRef, useState } from "react";
import { IMessage, IProjectState } from "../types";
import Message from "./Message";
import { ArrowUp } from "./Icons";
import { anthropicModels, openaiModels } from "../configs/aiModels";

export interface ChatViewProps {
  projectState: IProjectState;
  handleSaveCodeSnippet: (code: string, filePath: string) => void;
  handleGenerateTasksAndFiles: (projectState: IProjectState) => void;
  handleSendMessage: (message: string) => void;
  handleSyncProjectState: (projectState: IProjectState) => void;
  handleServiceChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleModelChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  messages: IMessage[];
  isLoading: boolean;
  error: string | null;
}

export const ChatView: React.FC<ChatViewProps> = ({ projectState,
  handleSaveCodeSnippet,
  handleGenerateTasksAndFiles,
  handleSendMessage,
  handleSyncProjectState,
  handleServiceChange,
  handleModelChange,
  messages,
  isLoading,
  error,
}) => {
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [inputMessage, setInputMessage] = useState("");
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages?.length]);

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-grow overflow-y-auto p-4 space-y-4 no-scrollbar">
        {messages?.map((message) => (
          <Message
            key={message.createdAt}
            message={message}
            onSaveCodeSnippet={handleSaveCodeSnippet}
            onAction={(type: string, value: boolean | string) => {
              if (type === "generate_tasks_and_files" && value === true) {
                handleGenerateTasksAndFiles(projectState);
              }
              if (type === "suggestion") {
                handleSendMessage(value as string);
              }
            }}
            onSyncProjectState={handleSyncProjectState}
          />
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
              AI is thinking...
            </div>
          </div>
        )}
        {error && (
          <div className="flex justify-center">
            <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg">
              {error}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-2 border-t">
        <div className="flex items-end space-x-2">
          <textarea
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(inputMessage);
              }
            }}
            className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Type your message... (Shift+Enter for new line)"
            disabled={isLoading}
            rows={2}
            style={{ minHeight: "2.5rem", maxHeight: "10rem" }}
          />
          <button
            onClick={() => handleSendMessage(inputMessage)}
            className="w-10 h-10 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center justify-center"
            disabled={isLoading}
          >
            <ArrowUp size={20} />
          </button>
        </div>
        <div className="mt-2 columns-2">
          <select
            value={projectState?.settings?.service}
            onChange={handleServiceChange}
            className="w-full` p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="openai">OpenAI</option>
            <option value="anthropic">Anthropic</option>
          </select>
          <select
            value={projectState?.settings?.model}
            onChange={handleModelChange}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {
              projectState?.settings?.service === 'openai' ?
                openaiModels.map((model) => (
                  <option key={model} value={model}>{model}</option>
                )) :
                anthropicModels.map((model) => (
                  <option key={model} value={model}>{model}</option>
                ))
            }
          </select>
        </div>
      </div>
    </div>
  );
};