import React from "react";
import Accordion from "./Accordion";
import OpenAI from "openai";

export const OpenAIMessage: React.FC<{ message: OpenAI.ChatCompletion }> = ({ message }) => {
  const [choiceIndex, setChoiceIndex] = React.useState(0);
  const choice = message.choices[choiceIndex];
  return (
    <div>
      <div className='space-y-2'>
        <h2 className='text-lg font-bold'>OpenAI {message.model} {choice?.message?.role}</h2>
        <p style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(choice?.message?.content, null, 2)}</p>
        <p style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(choice?.message?.tool_calls, null, 2)}</p>
        <Accordion
          title="Raw message"
          className="shadow-none max-w-full rounded-md py-0 hover:border-gray-500"
          titleClassName="text-xs text-gray-500"
          buttonClassName="hadow-none rounded-md py-0 hover:border-gray-500"
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
      <p className='text-xs opacity-50'>Usage: {message?.usage?.prompt_tokens}/{message?.usage?.completion_tokens}</p>
      <button onClick={() => setChoiceIndex((choiceIndex + 1) % message.choices.length)}>{choiceIndex + 1} choice</button>
    </div>
  );
};


