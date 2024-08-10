import { IBaseMessage } from "../types";
import Accordion from "./Accordion";

export default function UserMessage({ message }: { message: IBaseMessage }) {
  return (
    <div key={message.id} className={`flex flex-col p-2 rounded-md bg-blue-600 bg-opacity-50 hover:shadow-md items-center min-w-[600px] max-w-max select-text justify-end`}>
      <div className={`space-y-2`}>
        <h1 className="text-xl font-bold">User</h1>
        {typeof message?.content === 'string' && <p>{message?.content}</p>}
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