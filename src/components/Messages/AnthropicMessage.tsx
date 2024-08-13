import Anthropic from '@anthropic-ai/sdk';
import React from 'react';
import { IMessage, IProjectState } from '../../types';
import { readFiles } from '../../services/fsService';
import Accordion from '../Accordion';
import { ToolUseBlock } from '@anthropic-ai/sdk/resources/messages.mjs';
import { useAppDispatch } from '../../store';
import { setFileInModal } from '../../store/layoutSlice';
import { appendToInputValue } from '../../store/chatSlice';
import { MessageProjectStateUpdates } from "../MessageProjectStateUpdates";

export const AnthropicMessage: React.FC<{ message: IMessage }> = ({ message }) => {
  const dispatch = useAppDispatch();
  const renderTextBlock = (item: Anthropic.TextBlock, index: number) => <div key={index} style={{ whiteSpace: 'pre-wrap' }}>{item.text}</div>
  const renderToolBlock = (block: ToolUseBlock) => {
    const { type, name, id, input } = block;
    if (type === 'tool_use') {
      switch (name) {
        case 'getProjectStateFiles':
          const { paths } = input as { paths: string[] };
          if (!Array.isArray(paths)) { return (<p key={id} className="text-red-500 font-bold">Invalid paths</p>); }
          return (
            <div key={id} className="space-y-2 p-2 rounded-md bg-gray-300 bg-opacity-20">
              <p className="text-lg font-bold">The model requests a call to the function `{name}` with arguments:</p>
              <div className="flex flex-col space-y-2">
                {paths.map((path: string) => (
                  <button key={path} className='flex opacity-80 hover:opacity-100' onClick={() => { dispatch(setFileInModal({ path })) }}>
                    <p>{path}</p>
                  </button>
                ))}
              </div>
              <button
                onClick={async () => {
                  const files = await readFiles(paths);
                  const userMessage = `${(message as IMessage)?.context?.content}\nHere are the contents of some existing files for more context:\n\`\`\`json\n${JSON.stringify(files, null, 2)}\n\`\`\``;
                  dispatch(appendToInputValue(userMessage));
                }}
                className='px-3 bg-orange-500 hover:bg-orange-700 text-white font-bold rounded-full'
              >
                Add these files to context and run AI model call
              </button>
            </div>
          );
        case 'getProjectStateDescription':
          return (
            <div key={id} className="space-y-2 p-2 rounded-md bg-gray-300 bg-opacity-20">
              <p className="text-lg font-bold">The model requests a call to the function `{name}`</p>
              <button
                onClick={() => { console.log(`Call ${name}`); }}
                className="px-3 bg-yellow-500 hover:bg-yellow-700 text-white font-bold rounded-full"
              >
                Call {name}
              </button>
            </div>
          );
        case 'getProjectStateRequirements':
          return (
            <div key={id} className="space-y-2 p-2 rounded-md bg-gray-300 bg-opacity-20">
              <p className="text-lg font-bold">The model requests a call to the function `{name}`</p>
              <button
                onClick={() => { console.log(`Call ${name}`); }}
                className="px-3 bg-yellow-500 hover:bg-yellow-700 text-white font-bold rounded-full"
              >
                Call {name}
              </button>
            </div>
          );
        case 'getProjectStateTasks':
          return (
            <div key={id} className="space-y-2 p-2 rounded-md bg-gray-300 bg-opacity-20">
              <p className="text-lg font-bold">The model requests a call to the function `{name}`</p>
              <button
                onClick={() => { console.log(`Call ${name}`); }}
                className="px-3 bg-yellow-500 hover:bg-yellow-700 text-white font-bold rounded-full"
              >
                Call {name}
              </button>
            </div>
          );
        case 'updateProjectState':
          const { project_state_updates } = input as { project_state_updates: IProjectState };
          return (
            <div key={id} className="space-y-2 p-2 rounded-md bg-gray-300 bg-opacity-20">
              <p className="text-lg font-bold">The model requests a call to the function `{name}` with arguments:</p>
              <MessageProjectStateUpdates projectStateUpdates={project_state_updates} />
            </div>
          );
        default:
          return (
            <div key={id} className="space-y-2 p-2 rounded-md bg-gray-300 bg-opacity-20">
              <p className="text-lg font-bold">Unknown tool call: {name}</p>
              <pre className="whitespace-pre-wrap">{JSON.stringify(block, null, 2)}</pre>
            </div>
          );
      }
    }
  };
  return (
    <div key={message.id} className={`flex flex-col p-2 rounded-md bg-green-400 bg-opacity-30 hover:shadow-md items-center min-w-[600px] max-w-max select-text justify-start`}>
      <div className={`space-y-2`}>
        <h1 className="text-xl font-bold">Anthropic {message?.model} {message?.role}</h1>
        {typeof message?.content === 'string' && <p>{message?.content}</p>}
        {Array.isArray(message?.content) && message?.content?.map((item, index) => (item.type === 'text' ? renderTextBlock(item, index) : renderToolBlock(item)))}
        <p className='text-xs opacity-50'>Token usage: {(message as Anthropic.Message)?.usage?.input_tokens}/{(message as Anthropic.Message)?.usage?.output_tokens}</p>
        <p className='text-xs opacity-50'>Message id: {message?.id}</p>
        <Accordion
          title="Raw message"
          className=""
          titleClassName="text-xs"
          buttonClassName="opacity-50"
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