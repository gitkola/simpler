import Anthropic from '@anthropic-ai/sdk';
import React from 'react';
import { IBaseMessage, IMessage } from '../types';
import { readFiles, updateFiles } from '../services/fsService';
import Accordion from './Accordion';
import { ToolUseBlock } from '@anthropic-ai/sdk/resources/messages.mjs';
import { useAppDispatch } from '../store';
import { handleNewMessageToAIModel } from '../store/currentProjectSlice';
import createBaseMessage from "../utils/createBaseMessage";
import { setFileInModal } from '../store/layoutSlice';

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
              const userMessage = `${message?.context?.userMessage}\nHere are the contents of some existing files for more context:\n${JSON.stringify(files, null, 2)}`;
              await dispatch(handleNewMessageToAIModel(createBaseMessage(userMessage, "user")));
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
              const files = await updateFiles((block.input as { files: { path: string; content: string }[] }).files);
              (files).forEach((file) => {
                if (file.error) console.log(`Updated file error: ${file.path}`, file.error); // TODO: handle updateFiles errors
              });
            }}
            className='px-3 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-full'
          >
            Update these files in the Project State
          </button>
        </div >
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