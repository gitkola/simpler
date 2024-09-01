import { CoreUserMessage } from "ai";
import Accordion from "../Accordion";
import Markdown from "../MarkdownWrapper";

export default function UserMessage({ message }: { message: CoreUserMessage }) {
  return (
    <div className={`flex flex-col w-full p-2 rounded-md bg-blue-500 bg-opacity-30 select-text space-y-2`}>
      <h1 className="text-2xl font-bold capitalize">{message.role}</h1>
      {typeof message?.content === 'string' && <Markdown>{message?.content}</Markdown>}
      {Array.isArray(message?.content) && <>
        {message.content.map((contentItem, index) => {
          if (contentItem.type === 'text') {
            return <Markdown key={index}>{contentItem.text}</Markdown>;
          } else if (contentItem.type === 'image') {
            return <img key={index} src={contentItem.image as string} alt={contentItem.image as string} className="max-w-full h-auto" />;
          } else {
            return <Markdown key={index}>{JSON.stringify(contentItem, null, 2)}</Markdown>;
          }
        })}
      </>}
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