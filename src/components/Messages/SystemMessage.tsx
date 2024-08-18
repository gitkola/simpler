import { IBaseMessage } from "../../types";
import Accordion from "../Accordion";

export default function SystemMessage({ message }: { message: IBaseMessage }) {
  return (
    <div key={message.id} className={`flex flex-col p-2 rounded-md bg-gray-500 bg-opacity-30 select-text`}>
      <div className={`space-y-2 w-full`}>
        <Accordion
          title="System"
          content={<div style={{ whiteSpace: 'pre-wrap' }}>{message?.content}</div>}
        />
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
}