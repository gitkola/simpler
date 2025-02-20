import React from 'react';
import { IMessage } from '@/types';
import { AnthropicMessage } from './AnthropicMessage';
import UserMessage from './UserMessage';
import SystemMessage from './SystemMessage';
import { OpenAIMessage } from './OpenAIMessage';
import OpenAI from 'openai';
import Markdown from 'react-markdown';
import AssistantMessage from './AssistantMessage';
import ToolMessage from './ToolMessage';
import { CoreAssistantMessage, CoreMessage, CoreSystemMessage, CoreToolMessage, CoreUserMessage } from 'ai';
import { marked } from 'marked';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

interface MessageProps {
  message: CoreMessage | IMessage;
}

const renderCustomMessage = (message: MessageProps['message']) => {
  console.log('renderCustomMessage', message);
  if (typeof message.content === 'string') return <div>{`${marked.parse(message.content, { async: false, gfm: true })}`}</div>;
  return <Markdown>{JSON.stringify(message.content, null, 2)}</Markdown>;
  // if (message?.role === 'user') {
  //   return <UserMessage message={message as CoreUserMessage} />;
  // } else if (message?.role === 'system') {
  //   return <SystemMessage message={message as CoreSystemMessage} />;
  // } else if (message?.role === 'assistant') {
  //   return <AssistantMessage message={message as CoreAssistantMessage} />;
  // } else if (message?.role === 'tool') {
  //   return <ToolMessage message={message as CoreToolMessage} />;
  // } else if (message?.service === 'openai') {
  //   return <OpenAIMessage message={(message as OpenAI.ChatCompletion)} />;
  // } else if (message?.service === 'anthropic') {
  //   return <AnthropicMessage message={message} />;
  // } else {
  //   return <Markdown>{JSON.stringify(message, null, 2)}</Markdown>;
  // }
};

const Message: React.FC<MessageProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className={``}>
      {renderCustomMessage(message)}
    </div>
  );
};

export default Message;