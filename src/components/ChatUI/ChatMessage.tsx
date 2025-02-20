import { IMessage, IMessageRole } from "@/types";
import React, { useState } from 'react';
import Markdown from "../MarkdownWrapper";
import { Copy, Check } from 'lucide-react';
import { useAppDispatch } from "@/store";
import {
  getProjectStateFiles,
  getProjectStateDescriptions,
  getProjectStateRequirements,
  getProjectStateTasks,
  updateProjectState
} from "@/tools/toolFunctions";
import { handleSendMessage } from "@/store/handleSendMessage";
import createBaseMessage from "@/lib/utils/createBaseMessage";

interface ChatMessageProps {
  message: IMessage;
}

interface MessageContent {
  type: 'text' | 'tool_use' | 'code' | 'tool_result';
  text?: string;
  name?: string;
  input?: any;
  language?: string;
  id?: string;
  tool_use_id?: string;
  content?: string;
  is_error?: boolean;
}

interface ToolCallButtonProps {
  toolName: string;
  toolInput: any;
  message: IMessage;
  toolId: string;
}

const ToolCallButton: React.FC<ToolCallButtonProps> = ({ toolName, toolInput, message, toolId }) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToolCall = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let result;
      switch (toolName) {
        case 'getProjectStateFiles':
          result = await dispatch(getProjectStateFiles(toolInput.paths, message));
          break;
        case 'getProjectStateDescriptions':
          result = await dispatch(getProjectStateDescriptions(message));
          break;
        case 'getProjectStateRequirements':
          result = await dispatch(getProjectStateRequirements(message));
          break;
        case 'getProjectStateTasks':
          result = await dispatch(getProjectStateTasks(message));
          break;
        case 'updateProjectState':
          result = await dispatch(updateProjectState(toolInput.ProjectStateUpdates));
          break;
        default:
          throw new Error(`Unknown tool: ${toolName}`);
      }

      // Create tool result message
      const toolResultMessage = createBaseMessage('', 'tool' as IMessageRole);
      toolResultMessage.content = JSON.stringify([{
        type: 'tool_result',
        tool_use_id: toolId,
        content: JSON.stringify(result)
      }]);

      await dispatch(handleSendMessage(toolResultMessage));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Tool call error:', err);

      // Create tool error message
      const toolErrorMessage = createBaseMessage('', 'tool' as IMessageRole);
      toolErrorMessage.content = JSON.stringify([{
        type: 'tool_result',
        tool_use_id: toolId,
        content: `Error: ${err instanceof Error ? err.message : 'An error occurred'}`,
        is_error: true
      }]);

      await dispatch(handleSendMessage(toolErrorMessage));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="my-2 p-4 bg-gray-700 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Tool Call: {toolName}</h3>
      <pre className="bg-gray-800 p-2 rounded mb-2 overflow-x-auto">
        <code>{JSON.stringify(toolInput, null, 2)}</code>
      </pre>
      {error && (
        <div className="text-red-500 mb-2 p-2 bg-red-900 bg-opacity-20 rounded">
          {error}
        </div>
      )}
      <button
        onClick={handleToolCall}
        disabled={isLoading}
        className={`${isLoading
          ? 'bg-gray-500 cursor-not-allowed'
          : 'bg-blue-500 hover:bg-blue-600'
          } text-white px-4 py-2 rounded transition-colors flex items-center gap-2`}
      >
        {isLoading ? (
          <>
            <span className="animate-spin">⚡</span>
            Processing...
          </>
        ) : (
          'Confirm Tool Call'
        )}
      </button>
    </div>
  );
};

interface CodeBlockProps {
  code: string;
  language?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-lg bg-gray-900 p-4 my-2">
      {language && <div className="text-sm text-gray-400 mb-2">{language}</div>}
      <button
        onClick={copyCode}
        className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-200 bg-gray-800 rounded"
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </button>
      <pre className="text-sm text-gray-100 overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const renderContent = () => {
    if (typeof message.content === 'string') {
      return <Markdown>{message.content}</Markdown>;
    }

    if (Array.isArray(message.content)) {
      return (message.content as MessageContent[]).map((item: MessageContent, index: number) => {
        if (item.type === 'text' && item.text) {
          return <Markdown key={index}>{item.text}</Markdown>;
        }
        if (item.type === 'tool_use' && item.name && item.id) {
          return (
            <ToolCallButton
              key={index}
              toolName={item.name}
              toolInput={item.input}
              message={message}
              toolId={item.id}
            />
          );
        }
        if (item.type === 'code' && item.text) {
          return (
            <CodeBlock
              key={index}
              code={item.text}
              language={item.language}
            />
          );
        }
        return null;
      });
    }

    return null;
  };

  return (
    <div className={`rounded-lg p-4 mb-2 ${message.role === 'assistant' ? 'bg-gray-800' : 'bg-blue-900'
      } text-white`}>
      <div className="flex items-center mb-2">
        <span className="text-sm font-semibold capitalize">{message.role}</span>
        {/* {message.model && (
          <span className="ml-2 text-xs text-gray-400">({message.model})</span>
        )} */}
      </div>
      <div className="prose prose-invert max-w-none">
        {renderContent()}
      </div>
      {message.id && (
        <div className="mt-2 text-xs text-gray-400">
          ID: {message.id}
        </div>
      )}
    </div>
  );
}; 