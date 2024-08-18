import React from 'react';
import { IMessage } from '../../types';
import { AnthropicMessage } from './AnthropicMessage';
import UserMessage from './UserMessage';
import SystemMessage from './SystemMessage';
import { OpenAIMessage } from './OpenAIMessage';
import OpenAI from 'openai';

interface MessageProps {
  message: IMessage;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const renderCustomMessage = () => {
    if (message?.service === 'openai') {
      return <OpenAIMessage key={message?.id} message={(message as OpenAI.ChatCompletion)} />;
    } else if (message?.service === 'anthropic') {
      return <AnthropicMessage key={message?.id} message={message} />;
    } else if (message?.role === 'system') {
      return <SystemMessage key={message?.id} message={message} />;
    } else if (message?.role === 'user') {
      return <UserMessage key={message?.id} message={message} />;
    } else {
      return <div>{JSON.stringify(message, null, 2)}</div>;
    }
  };
  return (<div className={`flex overflow-hidden ${message?.role === 'user' ? 'justify-end' : ''}`}>{renderCustomMessage()}</div>);
};

export default Message;