import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { IMessage, MessageContent, ContentItem, isTitle, isText, isCode, isLink, isUpdatedProjectState } from '../types';
import { MessageProjectStateUpdates } from './MessageProjectStateUpdates';
import { writeFile } from '../utils/writeFile';


interface MessageProps {
  message: IMessage;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const renderContent = (item: ContentItem): JSX.Element => {
    if (isTitle(item)) {
      return <h3 key={item.id} className="text-lg font-bold">{item.title}</h3>;
    } else if (isText(item)) {
      try {
        const parsedText = JSON.parse(item.text);
        if (Array.isArray(parsedText)) {
          return (
            <div className="" key={item.id}>{parsedText.map((item) => renderContent(item))}</div>
          );
        } else {
          return <p key={item.id} className="">{item.text}</p>;
        }
      } catch (error) {
        return <p key={item.id} className="">{item.text}</p>;
      }
    } else if (isUpdatedProjectState(item)) {
      return (
        <MessageProjectStateUpdates key={item.id} projectStateUpdates={item?.updated_project_state} />
      );
    } else if (isCode(item)) {
      const [code, fileExt, filePath, description] = item.code;
      if (fileExt === 'json') {
        try {
          const parsedCode = JSON.parse(code);
          if (Array.isArray(parsedCode)) {
            return (
              <div className="" key={item.id}>{parsedCode.map((item) => renderContent(item))}</div>
            );
          }
        } catch (error) {
          return <p key={item.id} className="">{item.code}</p>;
        }
      }
      return (
        <div key={item.id} className="">
          <SyntaxHighlighter className="no-scrollbar rounded-md" language={fileExt || undefined} style={vscDarkPlus}>
            {code}
          </SyntaxHighlighter>
          {description && <p className="text-sm text-gray-500 mt-2">{description}</p>}
          <div className="flex items-center mt-2">
            <button
              onClick={async () => { await writeFile(code, filePath); }}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-md text-sm mr-2"
            >
              Save to
            </button>
            <span className="text-sm text-gray-500">{filePath || '/'}</span>
          </div>
        </div >
      );
    } else if (isLink(item)) {
      const [url, description] = item.link;
      return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 mt-8 hover:underline">
          {description || url}
        </a>
      );
    };
    return <p className="my-4">Unexpected content type</p>;
  };

  const parseMessageContent = (content: MessageContent | string): MessageContent | JSX.Element[] => {
    try {
      let parsedContent = content;
      if (typeof content === 'string') {
        parsedContent = JSON.parse(content);
      };
      if (Array.isArray(parsedContent)) {
        return parsedContent as MessageContent;
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
            <div className="flex items-center mb-2">
              <button
                onClick={async () => writeFile(code.trim(), '')}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-md text-sm mr-2"
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
    <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-3xl px-2 py-2 rounded-md ${message.role === 'user' ? 'bg-blue-500 text-white' :
        message.role === 'app' ? 'bg-green-500 text-white' :
          message.role === 'system' ? 'bg-yellow-500 text-black' :
            'bg-gray-300 text-gray-800'} hover:shadow-md`}>
        {Array.isArray(parsedContent) ? (
          parsedContent.map((item, index) => (
            <div key={index} className="mb-4">
              {React.isValidElement(item) ? item : renderContent(item as ContentItem)}
            </div>
          ))
        ) : (
          <p key={parsedContent} style={{ whiteSpace: 'pre-wrap' }} className="mb-4">{parsedContent}</p>
        )}
        <div className="mt-2 text-xs opacity-70">
          {new Date(message.createdAt).toLocaleString()}
          {(message.createdAt !== message.updatedAt) && " (edited)"}
        </div>
      </div>
    </div>
  );
};

export default Message;