import { IBaseMessage } from "../types";
import Accordion from "./Accordion";

export default function SystemMessage({ message }: { message: IBaseMessage }) {
  return (
    <div key={message.id} className={`flex flex-col p-2 rounded-md bg-gray-600 bg-opacity-50 hover:shadow-md items-center min-w-[600px] max-w-max select-text justify-end`}>
      <div className={`space-y-2`}>
        <Accordion
          title="System"
          content={<div style={{ whiteSpace: 'pre-wrap' }}>{message?.content}</div>}
        />
        <div className="text-xs opacity-50">
          {new Date((message as IBaseMessage)?.createdAt ?? '').toLocaleString()}
          {(message?.createdAt !== message?.updatedAt) && " (edited)"}
        </div>
        <Accordion
          title="Raw message"
          className=""
          titleClassName="text-xs opacity-50"
          buttonClassName=""
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