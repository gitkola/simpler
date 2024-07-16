import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { invoke } from '@tauri-apps/api/tauri';
import { join } from '@tauri-apps/api/path';
import { RootState } from "../store";
import { getAIResponseWithProjectState } from "../services/aiService";
import { ArrowUp } from "./Icons";
import { editProjectStateSettings, generateInitialProjectState, getProjectState, saveProjectState } from "../utils/projectStateUtils";
import { IMessage, IMessageAction, IProjectState, Requirement } from "../types";
import ProjectStateView from "./ProjectStateView";
import ResizablePanel from "./ResizablePanel";
import Message from "./Message";
import { anthropicModels, openaiModels } from "../configs/aiModels";


const SimplerProject: React.FC = () => {
  const [projectState, setProjectState] = useState<IProjectState | null>(null);
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

  useEffect(scrollToBottom, [projectState?.messages?.length]);

  useEffect(() => {
    loadProjectState();
  }, [activeProjectPath]);

  const loadProjectState = async () => {
    setIsLoadingProject(true);
    try {
      let projectState = await getProjectState(activeProjectPath);
      if (!projectState) {
        projectState = generateInitialProjectState(activeProjectPath);
      }
      setProjectState(() => projectState);

      if (!projectState.description) {
        addAppMessage("Please provide a description for the application you want to build.");
      } else if (!projectState.requirements || projectState.requirements.length === 0) {
        addAppMessage("Please provide a list of requirements for the application. Each requirement should be on a new line.");
      } else if ((!projectState.tasks || projectState.tasks.length === 0) || (!projectState.files || projectState.files.length === 0)) {
        addAppMessage("There are no tasks or file structure in the project state. Would you like me to generate initial tasks and file structure based on the project description and requirements?", "generate_tasks_and_files");
        setIsLoadingProject(false);
      }
    } catch (error) {
      console.error("Failed to load project state:", error);
      setError("Failed to load project state");
    }
    setIsLoadingProject(false);
  };

  const handleGenerateTasksAndFiles = async (projectState: IProjectState) => {
    if (!projectState) return;

    setIsLoading(true);
    setError(null);

    try {
      const { service, model, temperature, max_tokens } = projectState.settings;
      const { updatedProjectState, aiResponse } = await getAIResponseWithProjectState(
        "Generate or update tasks and file structure based on the project description and requirements.",
        { ...projectState, messages: [] },
        service,
        model,
        settings.apiKeys[service],
        temperature,
        max_tokens
      );

      const prevMessages = projectState.messages || [];
      const now = Date.now();
      const assistantMessage: IMessage = {
        content: aiResponse,
        role: 'assistant',
        createdAt: now,
        updatedAt: now,
      };
      const nextProjectState = { ...projectState, ...updatedProjectState, messages: [...prevMessages, assistantMessage] };
      setProjectState({
        ...nextProjectState
      });
      if (!nextProjectState.suggested_tasks || nextProjectState.suggested_tasks.length === 0) {
        addAppMessage("No suggested tasks found in AI response. Do you want AI to suggest possible next tasks for the developer?", "generate_suggested_tasks");
      } else {
        addAppMessage("Here are some suggested next steps:");
        nextProjectState.suggested_tasks.forEach(task => {
          addAppMessage(`Suggested task - ${task.description}`);
        });
      }
      await saveProjectState(activeProjectPath, { ...nextProjectState });
      if (!nextProjectState.suggested_tasks || nextProjectState.suggested_tasks.length === 0) {
        addAppMessage("No suggested tasks found in AI response. Do you want AI to suggest possible next tasks for the developer?", "generate_suggested_tasks");
        // throw new Error("No updatedProjectState.suggested_tasks found in AI response.");
      } else {
        addAppMessage("I've generated initial tasks and file structure. Here are some suggested next steps:");
        nextProjectState.suggested_tasks.forEach(task => {
          addAppMessage(`Suggested task - ${task.description}`);
        });
      }
      await saveProjectState(activeProjectPath, { ...nextProjectState });
    } catch (error) {
      console.error('Error generating tasks and files:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const addMessageToThread = (message: IMessage) => {
    setProjectState((prev) => {
      if (!prev) return prev;
      const updatedProjectState = { ...prev, messages: [...prev.messages || [], message] };
      return updatedProjectState;
    });
  };

  const addAppMessage = (content: string, action?: IMessageAction) => {
    const now = Date.now();
    const appMessage: IMessage = {
      content,
      role: 'app',
      createdAt: now,
      updatedAt: now,
      action,
    };
    addMessageToThread(appMessage);
  };

  const handleSendMessage = async (content: string) => {
    if (!projectState || content.trim() === '') return;

    setIsLoading(true);
    setError(null);

    const now = Date.now();
    const userMessage: IMessage = {
      content,
      role: 'user',
      createdAt: now,
      updatedAt: now,
    };

    addMessageToThread(userMessage);
    await saveProjectState(activeProjectPath, projectState);
    try {
      if (!projectState.description) {
        const updatedProjectState = { ...projectState, description: inputMessage, messages: [...projectState.messages || [], userMessage] };
        await saveProjectState(activeProjectPath, updatedProjectState);
        setProjectState(updatedProjectState);
        addAppMessage("Description added. Now, please provide a list of requirements for the application. Each requirement should be on a new line.");
      } else if (!projectState.requirements || projectState.requirements.length === 0) {
        const requirementDescriptions = inputMessage.split('\n').filter(req => req.trim() !== '');
        const requirements: Requirement[] = requirementDescriptions.map((description, index) => ({
          id: `REQ-${index + 1}`,
          description,
          status: "not_started",
          priority: "medium",
          createdAt: now,
          updatedAt: now,
        }));
        const updatedProjectState = { ...projectState, requirements, messages: [...projectState.messages || [], userMessage] };
        await saveProjectState(activeProjectPath, updatedProjectState);
        setProjectState(updatedProjectState);
        addAppMessage("Requirements added. Do you want to generate initial tasks and file structure by the model?", "generate_tasks_and_files");
        await handleGenerateTasksAndFiles(updatedProjectState);
      } else {
        const { service, model, temperature, max_tokens } = projectState.settings;
        const { updatedProjectState, aiResponse } = await getAIResponseWithProjectState(
          inputMessage,
          { ...projectState, messages: [] },
          service,
          model,
          settings.apiKeys[service],
          temperature,
          max_tokens
        );
        const prevMessages = projectState.messages || [];
        const now = Date.now();
        const assistantMessage: IMessage = {
          content: aiResponse,
          role: 'assistant',
          createdAt: now,
          updatedAt: now,
        };
        const nextProjectState = { ...projectState, ...updatedProjectState, messages: [...prevMessages, assistantMessage] };
        setProjectState({
          ...nextProjectState
        });
        if (!nextProjectState.suggested_tasks || nextProjectState.suggested_tasks.length === 0) {
          addAppMessage("No suggested tasks found in AI response. Do you want AI to suggest possible next tasks for the developer?", "generate_suggested_tasks");
        } else {
          addAppMessage("Here are some suggested next steps:");
          nextProjectState.suggested_tasks.forEach(task => {
            addAppMessage(`Suggested task - ${task.description}`);
          });
        }
        await saveProjectState(activeProjectPath, { ...nextProjectState });
      }
    } catch (error) {
      console.error('Error in message exchange:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
      setInputMessage('');
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

      await invoke('write_file', { filePath: fullPath, content: code });
    } catch (error) {
      console.error('Error saving file:', error);
    }
  };

  const handleServiceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!projectState) return;

    const service = e.target.value as "openai" | "anthropic";
    if (service === projectState?.settings?.service) return;
    const model = service === 'openai' ? openaiModels[0] : anthropicModels[0];
    const newSettings = { ...projectState.settings, service, model };
    await editProjectStateSettings(activeProjectPath, newSettings);
    setProjectState({ ...projectState, settings: newSettings });
  };

  const handleModelChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!projectState) return;

    const model = e.target.value;
    if (model === projectState?.settings?.model) return;
    const newSettings = { ...projectState.settings, model };
    await editProjectStateSettings(activeProjectPath, newSettings);
    setProjectState({ ...projectState, settings: newSettings });
  };

  const handleProjectStateItemClick = (item: string, type: string) => {
    console.log(`Clicked ${type}: ${item}`);
    // You can implement specific actions here, like opening a file or focusing on a task
  };

  if (isLoadingProject) return (<div className="flex h-full justify-center">
    <h2 className="m-auto">Loading...</h2>
  </div>);

  if (!projectState) return (<div className="flex h-full justify-center">
    <button onClick={loadProjectState} className="bg-blue-500 text-white px-4 py-2 m-auto rounded-lg">Load Project</button>
  </div>);

  const leftPanel = (
    <ProjectStateView projectState={projectState} onItemClick={handleProjectStateItemClick} />
  );
  const rightPanel = (
    <div className="flex flex-col h-full w-full shadow-lg rounded-lg">
      <div className="flex-grow overflow-y-auto p-4 space-y-4 no-scrollbar">
        {projectState.messages?.map((message) => (
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

  return (
    <div className="h-full w-full bg-white">
      <ResizablePanel left={leftPanel} right={rightPanel} initialLeftWidth={300} />
    </div>
  );
};

export default SimplerProject;