import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Message as MessageType, ModelResponse, ContentItem } from '../types';

interface MessageProps {
  message: MessageType;
  onSaveCodeSnippet: (code: string, filePath: string) => void;
}

const isTitle = (item: ContentItem): item is { title: string } => 'title' in item;
const isText = (item: ContentItem): item is { text: string } => 'text' in item;
const isCode = (item: ContentItem): item is { code: [string, string | null, string | null, string | null] } => 'code' in item;
const isLink = (item: ContentItem): item is { link: [string, string | null] } => 'link' in item;

const Message: React.FC<MessageProps> = ({ message, onSaveCodeSnippet }) => {
  const renderContent = (item: ContentItem): JSX.Element => {
    if (isTitle(item)) {
      return <h3 className="text-lg font-bold">{item.title}</h3>;
    } else if (isText(item)) {
      return <p>{item.text}</p>;
    } else if (isCode(item)) {
      const [code, fileExt, filePath, description] = item.code;
      return (
        <div>
          <SyntaxHighlighter language={fileExt || undefined} style={vscDarkPlus}>
            {code}
          </SyntaxHighlighter>
          {description && <p className="text-sm text-gray-500">{description}</p>}
          <div className="flex items-center mt-2">
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
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
          {description || url}
        </a>
      );
    }
    return <p>Unexpected content type</p>;
  };

  const parseMessageContent = (content: string): ModelResponse | JSX.Element[] => {
    try {
      // First, try to parse as JSON
      const parsedContent = JSON.parse(content);
      if (Array.isArray(parsedContent)) {
        return parsedContent as ModelResponse;
      }
      // If it's JSON but not an array, treat it as a string
      return parseTextWithCodeBlocks(JSON.stringify(parsedContent, null, 2));
    } catch (error) {
      // If JSON parsing fails, parse the original content for code blocks
      return parseTextWithCodeBlocks(content);
    }
  };

  const parseTextWithCodeBlocks = (text: string): JSX.Element[] => {
    const parts = text.split(/(```[\s\S]*?```)/);
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const [, language, code] = part.match(/```(\w*)\n([\s\S]*?)```/) || [, '', part.slice(3, -3)];
        return (
          <div key={index}>
            <SyntaxHighlighter language={language || undefined} style={vscDarkPlus}>
              {code.trim()}
            </SyntaxHighlighter>
            <div className="flex items-center mt-2">
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

  const parsedContent = parseMessageContent(message.content);

  return (
    <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-3xl px-4 py-2 rounded-lg ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
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
        <div className="mt-1 text-xs opacity-70">
          {new Date(message.createdAt).toLocaleString()}
          {message.edited && " (edited)"}
        </div>
      </div>
    </div>
  );
};

export default Message;