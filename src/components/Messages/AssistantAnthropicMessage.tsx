import * as Anthropic from "@anthropic-ai/sdk";
import Accordion from "../Accordion";
import Editor from "../Editor";
import Markdown from "../MarkdownWrapper";
import ReactMarkdown from 'react-markdown';

export default function AssistantAnthropicMessage({ message }: { message: Anthropic.Anthropic.Message }) {
  return (
    <div className={`flex flex-1 flex-col h-full w-full p-2 rounded-md bg-green-500 bg-opacity-30 select-text space-y-2`}>
      <h1 className="text-2xl font-bold capitalize">{message.role}</h1>
      <div className="flex flex-1 flex-col w-vw">
        {typeof message?.content === 'string' && <ReactMarkdown>{message?.content}</ReactMarkdown>}
        <div className="flex flex-1 flex-col w-vw">
          {Array.isArray(message?.content) && <>
            {message.content.map((contentItem, index) => {
              if (contentItem.type === 'text') {
                return <ReactMarkdown key={index}>{contentItem.text}</ReactMarkdown>;
              } else if (contentItem.type === 'tool_use') {
                return (
                  <div key={index} className="flex flex-1 flex-col h-full w-full">
                    <ReactMarkdown>
                      {`**${contentItem.type}:** \`${contentItem.name}\` toolCallId: ${contentItem.id}`}
                    </ReactMarkdown>
                    <div className="flex flex-1 flex-col w-full h-full">
                        <Editor language="json" value={JSON.stringify(contentItem.input, null, 2)} disabled />
                    </div>
                  </div>
                );
              } else {
                return <ReactMarkdown key={index}>{JSON.stringify(contentItem, null, 2)}</ReactMarkdown>;
              }
            })}
          </>}
        </div>
      </div>
      <Accordion
        title="Raw message"
        titleClassName="text-xs"
        content={
          <div
            style={{ whiteSpace: 'pre-wrap' }}
            className="text-xs"
          >
            {JSON.stringify(message, null, 2)}
          </div>
        }
      />
    </div>
  );
}