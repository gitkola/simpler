import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../store";
import { invoke } from '@tauri-apps/api/tauri';
import { join } from '@tauri-apps/api/path';
import { RootState } from "../store";
import { getAIResponseWithProjectState } from "../services/aiService";
import {
  mergeProjectStates,
} from "../utils/projectStateUtils";
import { IMessage, IMessageAction, IProjectState, Requirement } from "../types";
import ProjectStateView from "./ProjectStateView";
import ResizablePanel from "./ResizablePanel";
import { anthropicModels, openaiModels } from "../configs/aiModels";
import { ChatView } from "./ChatView";
import { loadProjectMessagesFromFile, loadProjectStateFromFile, saveProjectMessagesToFile, saveProjectStateToFile } from "../store/currentProjectSlice";
import { useOpenProject } from "../hooks/useOpenProject";


const SimplerProject: React.FC = () => {
  const [inputMessage, setInputMessage] = useState("");
  const [isLoadingProject, setIsLoadingProject] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const projectState = useAppSelector((state: RootState) => state.currentProject.currentProjectState);
  const messages = useAppSelector((state: RootState) => state.currentProject.currentProjectMessages);
  const settings = useAppSelector((state: RootState) => state.settings);
  const { activeProjectPath } = useAppSelector((state: RootState) => state.projects);
  const dispatch = useAppDispatch();
  const handleOpenProject = useOpenProject();

  useEffect(() => {
    loadData();
  }, [activeProjectPath]);

  const loadData = async () => {
    if (!activeProjectPath) return;
    setIsLoadingProject(true);
    try {
      await dispatch(loadProjectStateFromFile(activeProjectPath));
      await dispatch(loadProjectMessagesFromFile(activeProjectPath));
      if (!projectState?.description) {
        await addAppMessage("Please provide a description for the application you want to build.");
      } else if (!projectState?.requirements || projectState?.requirements.length === 0) {
        await addAppMessage("Please provide a list of requirements for the application. Each requirement should be on a new line.");
      } else if ((!projectState?.tasks || projectState?.tasks?.length === 0) || (!projectState?.files || projectState?.files?.length === 0)) {
        await addAppMessage("There are no tasks or file structure in the project state. Would you like me to generate initial tasks and file structure based on the project description and requirements?", "generate_tasks_and_files");
      }
    }
    catch (error) {
      console.error("Failed to load project state:", error);
      setError("Failed to load project state");
    }
    finally {
      setIsLoadingProject(false);
    }
  };

  const handleGenerateTasksAndFiles = async (projectState: IProjectState) => {
    if (!projectState || !activeProjectPath) return;

    setIsLoading(true);
    setError(null);

    try {
      const { service, model, temperature, max_tokens } = projectState.settings;
      const { updatedProjectState, aiResponse } = await getAIResponseWithProjectState(
        "Generate or update tasks and file structure based on the project description and requirements.",
        projectState,
        service,
        model,
        settings.apiKeys[service],
        temperature,
        max_tokens
      );

      const prevMessages = messages || [];
      const now = Date.now();
      const assistantMessage: IMessage = {
        content: aiResponse,
        role: 'assistant',
        createdAt: now,
        updatedAt: now,
      };
      const nextProjectState = mergeProjectStates(projectState, updatedProjectState);
      await dispatch(saveProjectStateToFile(activeProjectPath, nextProjectState));
      await dispatch(saveProjectMessagesToFile(activeProjectPath, [...prevMessages, assistantMessage]));
      if (!nextProjectState?.suggested_tasks || nextProjectState?.suggested_tasks?.length === 0) {
        await addAppMessage("No suggested tasks found in AI response. Do you want AI to suggest possible next tasks?", "generate_suggested_tasks");
      } else {
        await addAppMessage("Here are some suggested next steps:");
        for (const task of nextProjectState.suggested_tasks) {
          await addAppMessage(`Suggested task - ${task.description}`);
        }
      }
    } catch (error) {
      console.error('Error generating tasks and files:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred while generating tasks and files');
    } finally {
      setIsLoading(false);
    }
  };

  const addMessageToThread = async (message: IMessage) => {
    if (!projectState || !activeProjectPath) return;
    await dispatch(saveProjectMessagesToFile(activeProjectPath, [...(messages || []), message]));
  };

  const addAppMessage = async (content: string, action?: IMessageAction) => {
    const now = Date.now();
    const appMessage: IMessage = {
      content,
      role: 'app',
      createdAt: now,
      updatedAt: now,
      action,
    };
    await addMessageToThread(appMessage);
  };

  const handleSendMessage = async (content: string) => {
    if (!projectState || !activeProjectPath || content.trim() === '') return;

    setIsLoading(true);
    setError(null);

    const now = Date.now();
    const userMessage: IMessage = {
      content,
      role: 'user',
      createdAt: now,
      updatedAt: now,
    };

    try {
      await addMessageToThread(userMessage);
      await dispatch(saveProjectStateToFile(activeProjectPath, projectState));
      if (!projectState.description) {
        const updatedProjectState = { ...projectState, description: inputMessage, };
        await dispatch(saveProjectStateToFile(activeProjectPath, updatedProjectState));
        await addAppMessage("Description added. Now, please provide a list of requirements for the application. Each requirement should be on a new line.");
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
        const updatedProjectState = { ...projectState, requirements };
        await dispatch(saveProjectStateToFile(activeProjectPath, updatedProjectState));
        await addAppMessage("Requirements added. Do you want to generate initial tasks and file structure by AI model?", "generate_tasks_and_files");
        await handleGenerateTasksAndFiles(updatedProjectState);
      } else {
        const { service, model, temperature, max_tokens } = projectState.settings;
        const { updatedProjectState, aiResponse } = await getAIResponseWithProjectState(
          inputMessage,
          projectState,
          service,
          model,
          settings.apiKeys[service],
          temperature,
          max_tokens
        );

        const now = Date.now();
        const assistantMessage: IMessage = {
          content: aiResponse,
          role: 'assistant',
          createdAt: now,
          updatedAt: now,
        };
        await addMessageToThread(assistantMessage);
        const nextProjectState = mergeProjectStates(projectState, updatedProjectState);
        await dispatch(saveProjectStateToFile(activeProjectPath, nextProjectState));
        if (!nextProjectState.suggested_tasks || nextProjectState.suggested_tasks.length === 0) {
          await addAppMessage("No suggested tasks found in AI response. Do you want AI model to suggest possible next tasks?", "generate_suggested_tasks");
        } else {
          await addAppMessage("Here are some suggested next steps:");
          for (const task of nextProjectState.suggested_tasks) {
            await addAppMessage(`Suggested task - ${task.description}`);
          }
        }
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
    if (!projectState || !activeProjectPath) return;

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
    if (!projectState || !activeProjectPath) return;

    const service = e.target.value as "openai" | "anthropic";
    if (service === projectState?.settings?.service) return;
    const model = service === 'openai' ? openaiModels[0] : anthropicModels[0];
    const newSettings = { ...projectState.settings, service, model };
    await dispatch(saveProjectStateToFile(activeProjectPath, { ...projectState, settings: { ...newSettings } }));
  };

  const handleModelChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!projectState || !activeProjectPath) return;

    const model = e.target.value;
    if (model === projectState?.settings?.model) return;
    const newSettings = { ...projectState.settings, model };
    await dispatch(saveProjectStateToFile(activeProjectPath, { ...projectState, settings: { ...newSettings } }));
  };

  const handleProjectStateItemClick = (item: string, type: string) => {
    console.log(`Clicked ${type}: ${item}`);
    // You can implement specific actions here, like opening a file or focusing on a task
  };

  const handleSyncProjectState = async (value: IProjectState) => {
    if (!projectState || !activeProjectPath) return;
    const newProjectState = mergeProjectStates(projectState, value);
    try {
      await dispatch(saveProjectStateToFile(activeProjectPath, newProjectState));
    } catch (error) {
      console.error('Error syncing project state:', error);
    }
  };

  if (isLoadingProject) return (<div className="flex h-full justify-center">
    <h2 className="m-auto">Loading...</h2>
  </div>);

  if (!activeProjectPath) return (<div className="flex h-full justify-center">
    <button onClick={handleOpenProject} className="bg-blue-500 text-white px-4 py-2 m-auto rounded-lg">Open Project</button>
  </div>);

  if (!projectState) return (<div className="flex h-full justify-center">
    <button onClick={loadData} className="bg-blue-500 text-white px-4 py-2 m-auto rounded-lg">Load Project</button>
  </div>);

  const leftPanel = (
    <ProjectStateView onItemClick={handleProjectStateItemClick} />
  );

  const rightPanel = (
    <ChatView
      projectState={projectState}
      handleSaveCodeSnippet={handleSaveCodeSnippet}
      handleGenerateTasksAndFiles={handleGenerateTasksAndFiles}
      handleSendMessage={handleSendMessage}
      handleSyncProjectState={handleSyncProjectState}
      handleServiceChange={handleServiceChange}
      handleModelChange={handleModelChange}
      messages={messages || []}
      isLoading={isLoading}
      error={error}
    />
  );

  return (
    <div className="h-full w-full">
      <ResizablePanel left={leftPanel} right={rightPanel} initialLeftWidth={300} />
    </div>
  );
};

export default SimplerProject;