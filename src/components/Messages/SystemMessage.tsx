import { CoreSystemMessage } from "ai";
import Accordion from "../Accordion";
import Markdown from "../MarkdownWrapper";

export default function SystemMessage({ message }: { message: CoreSystemMessage }) {
  return (
    <div className={`flex flex-1 flex-col w-full p-2 rounded-md bg-gray-500 bg-opacity-30 select-text`}>
      <div className={`space-y-2 w-full h-full`}>
        {/* <Markdown>{message?.content}</Markdown> */}
        <Accordion
          title={message?.role}
          titleClassName="text-2xl font-bold capitalize"
          content={<Markdown>{message?.content}</Markdown>}
        />
      </div>
    </div>
  );
}