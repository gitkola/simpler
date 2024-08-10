import Anthropic from '@anthropic-ai/sdk';
import React from 'react';
import { IBaseMessage, IMessage, IProjectState } from '../../types';
import { readFiles } from '../../services/fsService';
import Accordion from '../Accordion';
import { ToolUseBlock } from '@anthropic-ai/sdk/resources/messages.mjs';
import { useAppDispatch } from '../../store';
import { setFileInModal } from '../../store/layoutSlice';
import { appendToInputValue } from '../../store/chatSlice';
import { MessageProjectStateUpdates } from "../MessageProjectStateUpdates";
import { syncProjectStateWithAIUpdates } from '../../store/currentProjectSlice';

export const AnthropicMessage: React.FC<{ message: IMessage }> = ({ message }) => {
  const dispatch = useAppDispatch();
  const renderTextBlock = (item: Anthropic.TextBlock, index: number) => <div key={index} style={{ whiteSpace: 'pre-wrap' }}>{item.text}</div>
  const renderToolBlock = (block: ToolUseBlock, index: number) => {
    if (block.type === 'tool_use' && block.name === 'readFiles') {
      return (
        <div key={index} className="space-y-2 p-2 rounded-md bg-gray-300 bg-opacity-20">
          <p className="text-lg font-bold">The model requests a call to the function `{block.name}` with arguments:</p>
          <div className="flex flex-col space-y-2">
            {(block.input as { paths: string[] }).paths.map((path, index) => <p key={index}>{path}</p>)}
          </div>
          <button
            onClick={async () => {
              const files = await readFiles((block.input as { paths: string[] }).paths);
              const userMessage = `${message?.context?.content}\nHere are the contents of some existing files for more context:\n${JSON.stringify(files, null, 2)}`;
              dispatch(appendToInputValue(userMessage));
            }}
            className='px-3 bg-orange-500 hover:bg-orange-700 text-white font-bold rounded-full'
          >
            Add these files to context and run AI model call
          </button>
        </div >
      );
    } else if (block.type === 'tool_use' && block.name === 'updateFiles') {
      return (
        <div key={index} className="space-y-2 p-2 rounded-md bg-gray-300 bg-opacity-20">
          <p className="text-lg font-bold">The model requests a call to the function `{block.name}` with arguments:</p>
          <div className="flex flex-col space-y-2">
            {(block.input as { files: { content: string; path: string }[] }).files.map((file) => (
              <button key={file.path} className='flex opacity-80 hover:opacity-100' onClick={() => { dispatch(setFileInModal(file)) }}>
                <p>{file.path}</p>
              </button>
            ))}
          </div>
          <button
            onClick={async () => {
              syncProjectStateWithAIUpdates(block.input as IProjectState)
            }}
            className='px-3 bg-yellow-500 hover:bg-yellow-700 text-white font-bold rounded-full'
          >
            Update files in Project State
          </button>
        </div >
      );
    } else if (block.type === 'tool_use' && block.name === 'updateProjectState') {
      return (
        <div key={index} className="space-y-2 p-2 rounded-md bg-gray-300 bg-opacity-20">
          <p className="text-lg font-bold">The model requests a call to the function `{block.name}` with arguments:</p>
          <MessageProjectStateUpdates projectStateUpdates={(block.input as { project_state_updates: IProjectState }).project_state_updates} />
        </div>
      );
    };
  };
  return (
    <div key={message.id} className={`flex flex-col p-2 rounded-md bg-green-600 bg-opacity-50 hover:shadow-md items-center min-w-[600px] max-w-max select-text justify-start`}>
      <div className={`space-y-2`}>
        <h1 className="text-xl font-bold">Anthropic {message?.model} {message?.role}</h1>
        {typeof message?.content === 'string' && <p>{message?.content}</p>}
        {Array.isArray(message?.content) && message?.content?.map((item, index) => (item.type === 'text' ? renderTextBlock(item, index) : renderToolBlock(item, index)))}
        <p className='text-xs opacity-50'>Token usage: {(message as Anthropic.Message)?.usage?.input_tokens}/{(message as Anthropic.Message)?.usage?.output_tokens}</p>
        <p className='text-xs opacity-50'>Message id: {message?.id}</p>
        <div className="text-xs opacity-50">
          {new Date((message as IBaseMessage)?.createdAt ?? '').toLocaleString()}
          {(message?.createdAt !== message?.updatedAt) && " (edited)"}
        </div>
        <Accordion
          title="Raw message"
          className=""
          titleClassName="text-xs opacity-50"
          buttonClassName=""
          content={
            <div
              style={{ whiteSpace: 'pre-wrap' }}
              className="text-xs opacity-50"
            >
              {JSON.stringify(message, null, 2)}
            </div>
          }
        />
      </div>
    </div>
  );
};