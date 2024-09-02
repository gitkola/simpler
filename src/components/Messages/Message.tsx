import React from 'react';
import { IMessage } from '../../types';
import { AnthropicMessage } from './AnthropicMessage';
import UserMessage from './UserMessage';
import SystemMessage from './SystemMessage';
import { OpenAIMessage } from './OpenAIMessage';
import OpenAI from 'openai';
import Markdown from 'react-markdown';
import AssistantMessage from './AssistantMessage';
import ToolMessage from './ToolMessage';
import { CoreAssistantMessage, CoreMessage, CoreSystemMessage, CoreToolMessage, CoreUserMessage } from 'ai';

interface MessageProps {
  message: CoreMessage | IMessage;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const renderCustomMessage = () => {
    if (message?.role === 'user') {
      return <UserMessage message={message as CoreUserMessage} />;
    } else if (message?.role === 'system') {
      return <SystemMessage message={message as CoreSystemMessage} />;
    } else if (message?.role === 'assistant') {
      return <AssistantMessage message={message as CoreAssistantMessage} />;
    } else if (message?.role === 'tool') {
      return <ToolMessage message={message as CoreToolMessage} />;
    } else if (message?.service === 'openai') {
      return <OpenAIMessage message={(message as OpenAI.ChatCompletion)} />;
    } else if (message?.service === 'anthropic') {
      return <AnthropicMessage message={message} />;
    } else {
      return <Markdown>{JSON.stringify(message, null, 2)}</Markdown>;
    }
  };

  return (
    <div className={`flex flex-col overflow-hidden ${message?.role === 'user' ? 'justify-end' : ''}`}>
      {renderCustomMessage()}
    </div>
  );
};

export default Message;