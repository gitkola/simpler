import React from "react";
import { Messages } from "./Icons";
import MessagesThread from "./Messages/MessagesThread";
import InputSection from "./InputSection";
import RenderCounter from "./RenderCounter";

export const ChatViewAISDK: React.FC = () => {
  return (
    <div className="flex flex-col border-r border-0.5 min-w-[900px] max-w-[1200px]">
      <RenderCounter name="ChatViewAISDK" />
      <div className="flex p-2 space-x-2 items-center justify-start border-b border-0.5">
        <Messages className="w-8 h-8" />
        <h2 className="text-lg font-semibold">AI Chat Vercel SDK</h2>
      </div>
      <div className="flex-1 flex flex-col justify-between overflow-hidden">
        <MessagesThread />
        <InputSection />
      </div>
    </div>
  );
};