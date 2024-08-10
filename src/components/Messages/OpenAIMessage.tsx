import React from "react";
import Accordion from "../Accordion";
import OpenAI from "openai";
import { readFiles, updateFiles } from '../../services/fsService';
import { useAppDispatch } from '../../store';
import { setFileInModal } from '../../store/layoutSlice';
import { appendToInputValue } from '../../store/chatSlice';
import { MessageProjectStateUpdates } from "../MessageProjectStateUpdates";
import { IMessage } from "../../types";

export const OpenAIMessage: React.FC<{ message: OpenAI.ChatCompletion }> = ({ message }: { message: OpenAI.ChatCompletion }) => {
  const dispatch = useAppDispatch();
  const [choiceIndex, setChoiceIndex] = React.useState(0);
  const choice = (message as OpenAI.ChatCompletion)?.choices[choiceIndex];

  const renderToolCalls = (toolCalls: OpenAI.ChatCompletionMessageToolCall[]) => {
    return toolCalls.map((toolCall) => {
      const { function: func, id } = toolCall;
      const { name, arguments: args } = func;

      switch (name) {
        case 'readFiles':
          return (
            <div key={id} className="space-y-2 p-2 rounded-md bg-gray-300 bg-opacity-20">
              <p className="text-lg font-bold">The model requests a call to the function `{name}` with arguments:</p>
              <div className="flex flex-col space-y-2">
                {JSON.parse(args).paths.map((path: string, index: number) => <p key={index}>{path}</p>)}
              </div>
              <button
                onClick={async () => {
                  const files = await readFiles(JSON.parse(args).paths);
                  const userMessage = `${(message as IMessage)?.context?.content}\nHere are the contents of some existing files for more context:\n${JSON.stringify(files, null, 2)}`;
                  dispatch(appendToInputValue(userMessage));
                }}
                className='px-3 bg-orange-500 hover:bg-orange-700 text-white font-bold rounded-full'
              >
                Add these files to context and run AI model call
              </button>
            </div>
          );
        case 'updateFiles':
          return (
            <div key={id} className="space-y-2 p-2 rounded-md bg-gray-300 bg-opacity-20">
              <p className="text-lg font-bold">The model requests a call to the function `{name}` with arguments:</p>
              <div className="flex flex-col space-y-2">
                {JSON.parse(args).files.map((file: { path: string; content: string }) => (
                  <button key={file.path} className='flex opacity-80 hover:opacity-100' onClick={() => { dispatch(setFileInModal(file)) }}>
                    <p>{file.path}</p>
                  </button>
                ))}
              </div>
              <button
                onClick={async () => {
                  const files = await updateFiles(JSON.parse(args).files);
                  files.forEach((file) => {
                    if (file.status === 'error') console.log(`Updated file error: ${file.path}`, file.error);
                  });
                }}
                className='px-3 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-full'
              >
                Write these files to disk
              </button>
            </div>
          );
        case 'updateProjectState':
          return (
            <div key={id} className="space-y-2 p-2 rounded-md bg-gray-300 bg-opacity-20">
              <p className="text-lg font-bold">The model requests a call to the function `{name}` with arguments:</p>
              <MessageProjectStateUpdates projectStateUpdates={JSON.parse(args).project_state_updates} />
            </div>
          );
        default:
          return (
            <div key={id} className="space-y-2 p-2 rounded-md bg-gray-300 bg-opacity-20">
              <p className="text-lg font-bold">Unknown tool call: {name}</p>
              <pre className="whitespace-pre-wrap">{JSON.stringify(func, null, 2)}</pre>
            </div>
          );
      }
    });
  };

  return (
    <div className="flex flex-col p-2 rounded-md bg-blue-600 bg-opacity-50 hover:shadow-md items-center min-w-[600px] max-w-max select-text justify-start">
      <div className='space-y-2'>
        <h2 className='text-lg font-bold'>OpenAI {message.model} {choice?.message?.role}</h2>
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
          className="shadow-none max-w-full rounded-md py-0 hover:border-gray-500"
          titleClassName="text-xs text-gray-500"
          buttonClassName="shadow-none rounded-md py-0 hover:border-gray-500"
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
