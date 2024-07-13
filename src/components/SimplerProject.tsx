import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { invoke } from '@tauri-apps/api/tauri';
import { join } from '@tauri-apps/api/path';
import { RootState } from "../store";
import { getAIResponse } from "../services/aiService";
import { ArrowUp } from "./Icons";
import { addMessageToChat, editProjectStateSettings, getProjectState } from "../utils/projectStateUtils";
import { Message as MessageType, MessageContent, ProjectState } from "../types";
import Message from "./Message";
import { anthropicModels, openaiModels } from "../configs/aiModels";


const SimplerProject: React.FC = () => {
  const [projectState, setProjectState] = useState<ProjectState | null>(null);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoadingProject, setIsLoadingProject] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const settings = useSelector((state: RootState) => state.settings);
  const { activeProjectPath } = useSelector((state: RootState) => state.projects);
  if (!activeProjectPath) return null;
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [projectState?.messages]);

  useEffect(() => {
    loadProjectState();
  }, [activeProjectPath]);

  const loadProjectState = async () => {
    setIsLoadingProject(true);
    try {
      const projectState = await getProjectState(activeProjectPath);
      setProjectState(projectState || null);
    } catch (error) {
      console.error("Failed to load chat:", error);
      setError("Failed to load chat history");
    }
    setIsLoadingProject(false);
  };

  const handleSendMessage = async () => {
    if (!projectState || inputMessage.trim() === '') return;

    setIsLoading(true);
    setError(null);
    const now = Date.now();
    const userMessage: MessageType = {
      content: inputMessage,
      role: 'user',
      createdAt: now,
      updatedAt: now,
    };
    setProjectState(prev => {
      if (!prev) return prev;
      return ({ ...prev, messages: [...prev?.messages || [], userMessage] });
    });

    try {
      await addMessageToChat(activeProjectPath, inputMessage, 'user');
      setInputMessage('');
      const { service, model, temperature, max_tokens } = projectState?.settings;
      const aiResponse: MessageContent = await getAIResponse(inputMessage, service, model, settings.apiKeys[service], temperature, max_tokens);
      // Convert MessageContent to a string
      const responseString = JSON.stringify(aiResponse);
      await addMessageToChat(activeProjectPath, responseString, 'assistant');
      await loadProjectState();
    } catch (error) {
      console.error('Error in message exchange:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCodeSnippet = async (code: string, suggestedPath: string) => {
    if (!projectState) return;

    try {
      let fileName: string;
      let directoryPath: string;

      if (suggestedPath) {
        const pathParts = suggestedPath.split('/');
        fileName = pathParts.pop() || ''; // Get the last part as filename
        directoryPath = pathParts.join('/'); // Join the rest as directory path
      } else {
        directoryPath = '/';
        const date = new Date();
        fileName = `snippet_${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}_${date.getHours().toString().padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}${date.getSeconds().toString().padStart(2, '0')}.txt`;
      }

      // Ensure the filename has an extension
      if (!fileName.includes('.')) {
        fileName += '.txt';
      }

      const fullPath = await join(activeProjectPath, directoryPath, fileName);

      // Use the write_file Rust function
      await invoke('write_file', { filePath: fullPath, content: code });

      console.log(`File saved successfully at: ${fullPath}`);
      // Optionally, you can update the UI to show a success message
    } catch (error) {
      console.error('Error saving file:', error);
      // Optionally, you can update the UI to show an error message
    }
  };

  const handleServiceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!projectState) return;

    const service = e.target.value as "openai" | "anthropic";
    if (service === projectState.settings.service) return;
    const model = service === 'openai' ? openaiModels[0] : anthropicModels[0];
    const newSettings = { ...projectState.settings, service, model };
    await editProjectStateSettings(activeProjectPath, newSettings);
    setProjectState({ ...projectState, settings: newSettings });
  };

  const handleModelChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!projectState) return;

    const model = e.target.value;
    if (model === projectState.settings.model) return;
    const newSettings = { ...projectState.settings, model };
    await editProjectStateSettings(activeProjectPath, newSettings);
    setProjectState({ ...projectState, settings: newSettings });
  };

  if (isLoadingProject) return (<div>Loading...</div>);

  if (!projectState) return (<button onClick={loadProjectState} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Load Project</button>)

  return (
    <div className="flex flex-col h-full bg-white shadow-lg rounded-lg">
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {projectState.messages?.map((message) => (
          <Message
            key={message.createdAt}
            message={message}
            onSaveCodeSnippet={handleSaveCodeSnippet}
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
                handleSendMessage();
              }
            }}
            className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Type your message... (Shift+Enter for new line)"
            disabled={isLoading}
            rows={2}
            style={{ minHeight: "2.5rem", maxHeight: "10rem" }}
          />
          <button
            onClick={handleSendMessage}
            className="w-10 h-10 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center justify-center"
            disabled={isLoading}
          >
            <ArrowUp size={20} />
          </button>
        </div>
        <div className="mt-2 columns-2">
          <select
            value={projectState.settings.service}
            onChange={handleServiceChange}
            className="w-full` p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="openai">OpenAI</option>
            <option value="anthropic">Anthropic</option>
          </select>
          <select
            value={projectState.settings.model}
            onChange={handleModelChange}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {
              projectState.settings.service === 'openai' ?
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

export default SimplerProject;