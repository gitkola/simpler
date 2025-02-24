import { useEffect, useRef } from "react";
// import { IMessage } from "@/types";
import { ChatMessage } from "./ChatMessage";
import Spinner from "../Spinner";
// import { RenderMessage } from "../render-message";
import { Message } from "ai";
import ChatMessages from "../chat-messages";

interface ChatThreadProps {
  messages: Message[];
  isLoading: boolean;
  error?: string;
  aiModelRequestInProgress: boolean;
  aiModelRequestError?: string;
}

export const ChatThread: React.FC<ChatThreadProps> = ({
  messages,
  isLoading,
  error,
  aiModelRequestInProgress,
  aiModelRequestError,
}) => {
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setTimeout(scrollToBottom, 10);
  }, [messages?.length]);

  return (
    <div className="flex-1 overflow-auto">
      <div className="pl-2 pt-2 pr-0.5 space-y-2 h-fit">
        {isLoading && (
          <div className="flex justify-center">
            <Spinner color="white" />
          </div>
        )}
        {error && (
          <div className="flex p-4 items-center justify-center bg-red-500">
            {error}
          </div>
        )}
        {/* {messages?.map((message) => (
          // <RenderMessage
          //   key={message.id}
          //   message={message}
          //   messageId={String(Date.now())}
          //   getIsOpen={(_id) => false}
          //   onOpenChange={() => {}}
          //   onQuerySelect={() => {}}
          // />
          <ChatMessage key={message.id} message={message} />
        ))} */}
        {/* <ChatMessages messages={messages} model={model} /> */}
        {aiModelRequestInProgress && (
          <div className="flex justify-center items-center">
            <Spinner color="white" />
          </div>
        )}
        {aiModelRequestError && (
          <div className="flex justify-center">
            <div className="bg-red-100 text-red-800 px-2 py-2 rounded-md">
              {aiModelRequestError}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
