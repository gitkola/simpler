import { IBaseMessage } from "../../types";
import Accordion from "../Accordion";
import Editor from "../Editor";
import Markdown from "../MarkdownWrapper";

export default function AssistantMessage({ message }: { message: IBaseMessage }) {
  return (
    <div key={message.id} className={`flex flex-col w-full p-2 rounded-md bg-green-500 bg-opacity-30 select-text space-y-2`}>
      <h1 className="text-2xl font-bold">{message.role}</h1>
      <div className="flex flex-col w-vw">
        {typeof message?.content === 'string' && <Markdown>{message?.content}</Markdown>}
        <div className="flex flex-col w-vw">
          {Array.isArray(message?.content) && <>
            {message.content.map((contentItem, index) => {
              if (contentItem.type === 'text') {
                return <Markdown key={index}>{contentItem.text}</Markdown>;
              } else if (contentItem.type === 'tool-call') {
                return (<div key={index}>
                  <Markdown>
                    {`**${contentItem.type}:** ${contentItem.toolName}`}
                  </Markdown>
                  <Editor language="json" value={JSON.stringify(contentItem.args, null, 2)} />
                </div>);
              } else {
                return <Markdown key={index}>{JSON.stringify(contentItem, null, 2)}</Markdown>;
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