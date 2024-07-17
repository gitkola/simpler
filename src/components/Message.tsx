import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { IMessage, IMessageContent, ContentItem, IProjectState } from '../types';
import { MessageProjectStateUpdates } from './MessageProjectStateUpdates';

interface MessageProps {
  message: IMessage;
  onSaveCodeSnippet: (code: string, filePath: string) => void;
  onAction?: (type: string, value: boolean | string) => void;
  onSyncProjectState: (data: IProjectState) => void;
}

const isTitle = (item: ContentItem): item is { title: string } => 'title' in item;
const isText = (item: ContentItem): item is { text: string } => 'text' in item;
const isCode = (item: ContentItem): item is { code: [string, string | null, string | null, string | null] } => 'code' in item;
const isLink = (item: ContentItem): item is { link: [string, string | null] } => 'link' in item;
const isUpdatedProjectState = (item: ContentItem): item is { updated_project_state: IProjectState } => 'updated_project_state' in item;

const Message: React.FC<MessageProps> = ({ message, onSaveCodeSnippet, onAction, onSyncProjectState }) => {
  const renderContent = (item: ContentItem): JSX.Element => {
    if (isTitle(item)) {
      return <h3 className="text-lg font-bold mt-4">{item.title}</h3>;
    } else if (isText(item)) {
      return <p className='mt-4'>{item.text}</p>;
    } else if (isCode(item)) {
      const [code, fileExt, filePath, description] = item.code;
      return (
        <div >
          <SyntaxHighlighter className="no-scrollbar rounded-md" language={fileExt || undefined} style={vscDarkPlus}>
            {code}
          </SyntaxHighlighter>
          {description && <p className="text-sm text-gray-500 mt-2">{description}</p>}
          <div className="flex items-center my-4">
            <button
              onClick={() => onSaveCodeSnippet(code, filePath || '')}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm mr-2"
            >
              Save to
            </button>
            <span className="text-sm text-gray-500">{filePath || 'No path suggested'}</span>
          </div>
        </div>
      );
    } else if (isLink(item)) {
      const [url, description] = item.link;
      return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 my-4 hover:underline">
          {description || url}
        </a>
      );
    } else if (isUpdatedProjectState(item)) {
      return (
        <MessageProjectStateUpdates content={item?.updated_project_state} onPressSync={onSyncProjectState} />
      );
    };
    return <p className="my-4">Unexpected content type</p>;
  };

  const parseMessageContent = (content: IMessageContent | string): IMessageContent | JSX.Element[] => {
    try {
      let parsedContent = content;
      if (typeof content === 'string') {
        parsedContent = JSON.parse(content);
      };
      if (Array.isArray(parsedContent)) {
        return parsedContent as IMessageContent;
      }
      return parseTextWithCodeBlocks(JSON.stringify(parsedContent, null, 2));
    } catch (error) {
      return parseTextWithCodeBlocks(content as string);
    }
  };

  const parseTextWithCodeBlocks = (text: string): JSX.Element[] => {
    if (typeof text !== 'string') return [];
    const parts = text.split(/(```[\s\S]*?```)/);
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const [, language, code] = part.match(/```(\w*)\n([\s\S]*?)```/) || [, '', part.slice(3, -3)];
        return (
          <div key={index}>
            <SyntaxHighlighter language={language || undefined} style={vscDarkPlus}>
              {code.trim()}
            </SyntaxHighlighter>
            <div className="flex items-center my-2">
              <button
                onClick={() => onSaveCodeSnippet(code.trim(), '')}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm mr-2"
              >
                Save to
              </button>
              <span className="text-sm text-gray-500">No path suggested</span>
            </div>
          </div>
        );
      } else {
        return <p key={index} style={{ whiteSpace: 'pre-wrap' }}>{part}</p>;
      }
    });
  };

  const renderActionButtons = () => {
    if (message.role === 'app' && message.action === 'generate_tasks_and_files' && onAction) {
      return (
        <div className="mt-2 flex space-x-2">
          <button
            onClick={() => onAction(message.action!, true)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm"
          >
            Yes
          </button>
          <button
            onClick={() => onAction(message.action!, false)}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
          >
            No
          </button>
        </div>
      );
    } else if (message.role === 'app' && message.action === 'suggestion' && onAction) {
      return (
        <div className="mt-2">
          <button
            onClick={() => onAction(message.action!, message.content as string)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm"
          >
            Use
          </button>
        </div>
      );
    }
    return null;
  };

  const parsedContent = parseMessageContent(message.content);

  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-8`}>
      <div className={`max-w-3xl px-4 py-2 rounded-lg ${message.role === 'user' ? 'bg-blue-500 text-white' :
        message.role === 'app' ? 'bg-green-500 text-white' :
          message.role === 'system' ? 'bg-yellow-500 text-black' :
            'bg-gray-200 text-gray-800'
        }`}>
        {Array.isArray(parsedContent) ? (
          parsedContent.map((item, index) => (
            <div key={index}>
              {React.isValidElement(item) ? item : renderContent(item as ContentItem)}
            </div>
          ))
        ) : (
          <p style={{ whiteSpace: 'pre-wrap' }}>{parsedContent}</p>
        )}
        {renderActionButtons()}
        <div className="mt-4 text-xs opacity-70">
          {new Date(message.createdAt).toLocaleString()}
          {(message.createdAt !== message.updatedAt) && " (edited)"}
        </div>
      </div>
    </div>
  );
};

export default Message;