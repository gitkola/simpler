import Anthropic from '@anthropic-ai/sdk';
import React from 'react';
import { IMessage, IProjectState } from '../../types';
import Accordion from '../Accordion';
import { ToolUseBlock } from '@anthropic-ai/sdk/resources/messages.mjs';
import { useAppDispatch } from '../../store';
import { setFileInModal } from '../../store/layoutSlice';
import { MessageProjectStateUpdates } from "./MessageProjectStateUpdates";
import { getProjectStateDescriptions, getProjectStateFiles, getProjectStateRequirements, getProjectStateTasks } from '../../store/actions/toolFunctions';

export const AnthropicMessage: React.FC<{ message: IMessage }> = ({ message }) => {
  const dispatch = useAppDispatch();
  const renderTextBlock = (item: Anthropic.TextBlock, index: number) => <div key={index} style={{ whiteSpace: 'pre-wrap' }}>{item.text}</div>
  const renderToolBlock = (block: ToolUseBlock) => {
    const { name, id, input } = block;

    switch (name) {
      case 'getProjectStateFiles':
        const { paths } = input as { paths: string[] };
        if (!Array.isArray(paths)) { return (<p key={id} className="text-red-500 font-bold">Invalid paths</p>); }
        return (
          <div key={id} className="space-y-2 p-2 rounded-md bg-gray-500 bg-opacity-50">
            <p className="text-lg font-bold">The model requests a call to the function `{name}` with arguments:</p>
            <div className="flex flex-col space-y-2">
              {paths.map((path: string) => (
                <button key={path} className='flex opacity-80 hover:opacity-100' onClick={() => { dispatch(setFileInModal({ path })) }}>
                  <p>{path}</p>
                </button>
              ))}
            </div>
            <button
              onClick={async () => { await dispatch(getProjectStateFiles(paths, message)); }}
              className='px-3 bg-orange-500 hover:bg-orange-700 text-white font-bold rounded-full'
            >
              Add these files to context and run AI model call
            </button>
          </div>
        );
      case 'getProjectStateDescriptions':
        return (
          <div key={id} className="space-y-2 p-2 rounded-md bg-gray-500 bg-opacity-50">
            <p className="text-lg font-bold">The model requests a call to the function `{name}`</p>
            <button
              onClick={async () => { await dispatch(getProjectStateDescriptions(message)); }}
              className="px-3 bg-green-500 hover:bg-green-700 text-white font-bold rounded-full"
            >
              Call {name}
            </button>
          </div>
        );
      case 'getProjectStateRequirements':
        return (
          <div key={id} className="space-y-2 p-2 rounded-md bg-gray-500 bg-opacity-50">
            <p className="text-lg font-bold">The model requests a call to the function `{name}`</p>
            <button
              onClick={async () => { await dispatch(getProjectStateRequirements(message)); }}
              className="px-3 bg-green-500 hover:bg-green-700 text-white font-bold rounded-full"
            >
              Call {name}
            </button>
          </div>
        );
      case 'getProjectStateTasks':
        return (
          <div key={id} className="space-y-2 p-2 rounded-md bg-gray-500 bg-opacity-50">
            <div className="text-lg font-bold">The model requests a call to the function `{name}`</div>
            <button
              onClick={async () => { await dispatch(getProjectStateTasks(message)); }}
              className="px-3 bg-green-500 hover:bg-green-700 text-white font-bold rounded-full"
            >
              Call {name}
            </button>
          </div>
        );
      case 'updateProjectState':
        const { ProjectStateUpdates } = input as { ProjectStateUpdates: IProjectState };
        return (
          <div key={id} className="space-y-2 p-2 rounded-md bg-gray-500 bg-opacity-50">
            <p className="text-lg font-bold">The model requests a call to the function `{name}` with arguments:</p>
            <MessageProjectStateUpdates projectStateUpdates={ProjectStateUpdates} />
          </div>
        );
      default:
        return (
          <div key={id} className="sspace-y-2 p-2 rounded-md bg-gray-500 bg-opacity-50">
            <p className="text-lg font-bold">Unknown tool call: {name}</p>
            <pre className="whitespace-pre-wrap">{JSON.stringify(block, null, 2)}</pre>
          </div>
        );
    }
  };
  return (
    <div key={message.id} className={`p-2 w-full rounded-md bg-green-400 bg-opacity-30 select-text`}>
      <div className={`space-y-2`}>
        <h1 className="font-bold">Anthropic {message?.model} {message?.role}</h1>
        {typeof message?.content === 'string' && <p>{message?.content}</p>}
        {Array.isArray(message?.content) && message?.content?.map((item, index) => (item.type === 'tool_use' ? renderToolBlock(item) : renderTextBlock(item, index)))}
        <p className='text-xs opacity-50'>Token usage: {(message as Anthropic.Message)?.usage?.input_tokens}/{(message as Anthropic.Message)?.usage?.output_tokens}</p>
        <p className='text-xs opacity-50'>Message id: {message?.id}</p>
        <Accordion
          title="Raw message"
          titleClassName="text-xs"
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