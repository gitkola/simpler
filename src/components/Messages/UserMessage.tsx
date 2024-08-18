import { IBaseMessage } from "../../types";
import Accordion from "../Accordion";

export default function UserMessage({ message }: { message: IBaseMessage }) {
  return (
    <div key={message.id} className={`flex flex-col w-full p-2 rounded-md bg-blue-500 bg-opacity-30 select-text space-y-2`}>
      <h1 className="text-xl font-bold">User</h1>
      <div className="flex w-vw">
        {typeof message?.content === 'string' && <div className="flex flex-col w-fit overflow-visible" style={{ whiteSpace: 'pre-wrap' }}>{message?.content}</div>}
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