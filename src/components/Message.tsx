import React from 'react';
import { IMessage, MessageContent, ContentItem, isTitle, isText, isCode, isLink, isUpdatedProjectState } from '../types';
import { MessageProjectStateUpdates } from './MessageProjectStateUpdates';
import { writeFile } from '../utils/writeFile';
import Accordion from './Accordion';
import Editor from './Editor';

interface MessageProps {
  message: IMessage;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const renderContent = (item: ContentItem): JSX.Element => {
    if (isTitle(item)) {
      return <h3 style={{ whiteSpace: 'pre-wrap' }} key={item.id} className="text-lg font-bold">{item.title}</h3>;
    } else if (isText(item)) {
      try {
        if (typeof item.text !== 'string') throw new Error('Value is not a string');
        if (item.text === '') return <p key={item.id}></p>;
        if (item.text.startsWith('[') && item.text.endsWith(']')) {
          const parsedText = JSON.parse(item.text);
          if (Array.isArray(parsedText)) {
            return (
              <div className="space-y-2" key={item.id}>{parsedText.map((item) => renderContent(item))}</div>
            );
          } else {
            return <p style={{ whiteSpace: 'pre-wrap' }} key={item.id}>{item.text}</p>;
          }
        } else if (item.text.startsWith('{') && item.text.endsWith('}')) {
          return renderContent(JSON.parse(item.text));
        } else {
          return <p style={{ whiteSpace: 'pre-wrap' }} key={item.id}>{item.text}</p>;
        }
      } catch (error) {
        return (
          <div key={item.id} className="space-y-2">
            <p style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(item.text, null, 2)}</p>
            <p style={{ whiteSpace: 'pre-wrap' }} className="text-sm text-red-500">Error: {(error as Error).message ? (error as Error).message : JSON.stringify(error, null, 2)}</p>
          </div>
        );
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
              <div className="space-y-2" key={item.id}>{parsedCode.map((item) => renderContent(item))}</div>
            );
          } else if (parsedCode?.updated_project_state) {
            return <MessageProjectStateUpdates key={item.id} projectStateUpdates={parsedCode?.updated_project_state} />;
          }
        } catch (error) {
          return (
            <div key={item.id} className="space-y-2">
              <p style={{ whiteSpace: 'pre-wrap' }}>{item.code}</p>
              <p style={{ whiteSpace: 'pre-wrap' }} className="text-sm text-red-500">Error: {(error as Error).message ? (error as Error).message : JSON.stringify(error, null, 2)}</p>
            </div>
          );
        }
      }
      return (
        <div key={item.id} className="space-y-2">
          {renderCodeBlock(code, fileExt || undefined)}
          {description && <p style={{ whiteSpace: 'pre-wrap' }} className="text-sm text-gray-500">{description}</p>}
          <div className="flex items-center space-x-2">
            <button
              onClick={async () => { await writeFile(code, filePath); }}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-md text-sm"
            >
              Write to file
            </button>
            <span style={{ whiteSpace: 'pre-wrap' }} className="text-sm text-gray-500">{filePath || '/'}</span>
          </div>
        </div>
      );
    } else if (isLink(item)) {
      const [url, description] = item.link;
      return (
        <a href={url} style={{ whiteSpace: 'pre-wrap' }} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
          {description || url}
        </a>
      );
    };
    return <p key={item?.id} style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(item, null, 2)}</p>;
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
      return parseTextWithCodeBlocks(JSON.stringify(parsedContent, null, 2)); // TODO: try without JSON.stringify
    } catch (error) {
      return parseTextWithCodeBlocks(content as string); // TODO: try with JSON.stringify
    }
  };

  const parseTextWithCodeBlocks = (text: string): JSX.Element[] => {
    try {

      if (typeof text !== 'string') throw new Error('Value is not a string');
      const parts = text.split(/(```[\s\S]*?```)/);
      return parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const [, language, code] = part.match(/```(\w*)\n([\s\S]*?)```/) || [, '', part.slice(3, -3)];
          return (
            <div key={index} className="space-y-2">
              {renderCodeBlock(code.trim(), language)}
              <div className="flex items-center space-x-2">
                <button
                  onClick={async () => writeFile(code.trim(), '')}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-md text-sm"
                >
                  Write to file
                </button>
                <span className="text-sm text-gray-500">No path suggested</span>
              </div>
            </div>
          );
        } else {
          return <p key={index} style={{ whiteSpace: 'pre-wrap' }}>{part}</p>;
        }
      });
    } catch (error) {
      const stringifiedText = JSON.stringify(text, null, 2);
      return [(
        <div key={stringifiedText} className="space-y-2">
          <p style={{ whiteSpace: 'pre-wrap' }}>{stringifiedText}</p>
          <p style={{ whiteSpace: 'pre-wrap' }} className="text-sm text-red-500">Error: {(error as Error).message ? (error as Error).message : JSON.stringify(error, null, 2)}</p>
        </div>
      )];
    }
  };

  const renderCodeBlock = (code: string, language: string = 'txt') => {
    return (
      <Editor
        value={code}
        language={language}
        minHeight={24}
        style={{
          marginLeft: 25,
          lineHeight: 1.6,
        }}
        disabled={true}
      />
    );
  };

  const parsedContent = parseMessageContent(message?.content);

  return (
    <div key={message.id} className={`flex flex-col min-w-[600px] max-w-max select-text ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`p-2 space-y-2 rounded-md ${message.role === 'user' ? 'bg-blue-600 bg-opacity-20' : 'bg-gray-600 bg-opacity-20'} hover:shadow-md`}>
        {Array.isArray(parsedContent) ? (
          parsedContent.map((item, index) => {
            if (React.isValidElement(item)) {
              return (<div key={`${Date.now()}${index}`} className="flex flex-col mb-4 rounded-md max-w-[800px] space-y-2">{item}</div>);
            }
            return (
              <div key={`${Date.now()}${index}`} className="flex flex-col mb-4 rounded-md max-w-[800px] space-y-2">
                {renderContent(item as ContentItem)}
              </div>
            );
          })
        ) : (
          <p key={parsedContent} style={{ whiteSpace: 'pre-wrap' }} className="mb-4">
            {parsedContent}
          </p>
        )}
        <div className="mt-2 text-xs opacity-70">
          {new Date(message.createdAt).toLocaleString()}
          {(message.createdAt !== message.updatedAt) && " (edited)"}
        </div>
        <Accordion
          title="Raw message"
          className="shadow-none max-w-full rounded-md py-0 hover:border-gray-500"
          titleClassName="text-xs text-gray-500"
          buttonClassName="hadow-none rounded-md py-0 hover:border-gray-500"
          content={
            <div
              style={{ whiteSpace: 'pre-wrap' }}
              className="text-xs text-gray-500 p-2"
            >
              {JSON.stringify(message, null, 2)}
            </div>
          }
        />
      </div>
    </div>
  );
};

export default Message;