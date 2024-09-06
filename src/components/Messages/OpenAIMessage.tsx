import React from "react";
import Accordion from "../Accordion";
import OpenAI from "openai";
import { useAppDispatch } from '../../store';
import { setFileInModal } from '../../store/layoutSlice';
import { MessageProjectStateUpdates } from "./MessageProjectStateUpdates";
import { IMessage } from "../../types";
import { getProjectStateDescriptions, getProjectStateFiles, getProjectStateRequirements, getProjectStateTasks } from "../../tools/toolFunctions";

export const OpenAIMessage: React.FC<{ message: OpenAI.ChatCompletion }> = ({ message }: { message: OpenAI.ChatCompletion }) => {
  const dispatch = useAppDispatch();
  const [choiceIndex, setChoiceIndex] = React.useState(0);
  const choice = (message as OpenAI.ChatCompletion)?.choices[choiceIndex];

  const renderToolCalls = (toolCalls: OpenAI.ChatCompletionMessageToolCall[]) => {
    return toolCalls.map((toolCall) => {
      const { function: func, id } = toolCall;
      const { name, arguments: args } = func;

      switch (name) {
        case 'getProjectStateFiles':
          const argument = JSON.parse(args);
          if (!Array.isArray(argument?.paths)) { return (<p key={id} className="text-red-500 font-bold">Invalid paths</p>); }
          const paths = [...argument.paths];
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
                onClick={async () => { await dispatch(getProjectStateFiles(paths, message as IMessage)); }}
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
                onClick={async () => { await dispatch(getProjectStateDescriptions(message as IMessage)); }}
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
                onClick={async () => { await dispatch(getProjectStateRequirements(message as IMessage)); }}
                className="px-3 bg-green-500 hover:bg-green-700 text-white font-bold rounded-full"
              >
                Call {name}
              </button>
            </div>
          );
        case 'getProjectStateTasks':
          return (
            <div key={id} className="space-y-2 p-2 rounded-md bg-gray-500 bg-opacity-50">
              <p className="text-lg font-bold">The model requests a call to the function `{name}`</p>
              <button
                onClick={async () => { await dispatch(getProjectStateTasks(message as IMessage)); }}
                className="px-3 bg-green-500 hover:bg-green-700 text-white font-bold rounded-full"
              >
                Call {name}
              </button>
            </div>
          );
        case 'updateProjectState':
          return (
            <div key={id} className="space-y-2 p-2 rounded-md bg-gray-500 bg-opacity-50">
              <p className="text-lg font-bold">The model requests a call to the function `{name}` with arguments:</p>
              <MessageProjectStateUpdates projectStateUpdates={JSON.parse(args).updates} />
            </div>
          );
        default:
          return (
            <div key={id} className="space-y-2 p-2 rounded-md bg-gray-500 bg-opacity-50">
              <p className="text-lg font-bold">Unknown tool call: {name}</p>
              <pre className="whitespace-pre-wrap">{JSON.stringify(func, null, 2)}</pre>
            </div>
          );
      }
    });
  };

  return (
    <div className="p-2 w-full rounded-md bg-green-400 bg-opacity-30 select-text">
      <div className='space-y-2'>
        <h2 className='font-bold'>OpenAI {message.model} {choice?.message?.role}</h2>
        {choice?.message?.content && <p style={{ whiteSpace: 'pre-wrap' }}>{choice.message.content}</p>}
        {choice?.message?.tool_calls && renderToolCalls(choice.message.tool_calls)}
        <p className='text-xs opacity-50 flex items-center justify-start'>Usage: {message?.usage?.prompt_tokens}/{message?.usage?.completion_tokens}</p>
        {message.choices.length > 1 && (
          <button onClick={() => setChoiceIndex((choiceIndex + 1) % message.choices.length)}>
            {choiceIndex + 1} of {message.choices.length} choices
          </button>
        )}
        <Accordion
          title="Raw message"
          className=""
          titleClassName="text-xs"
          buttonClassName="opacity-50"
          content={
            <div
              style={{ whiteSpace: 'pre-wrap' }}
              className="text-xs text-gray-500 py-2"
            >
              {JSON.stringify(message, null, 2)}
            </div>
          }
        />
      </div>
    </div>
  );
};
