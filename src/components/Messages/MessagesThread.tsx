import React, { useEffect, useMemo, useRef } from "react";
import { RootState, useAppSelector } from "../../store";
import { IMessage } from "../../types";
import ProcessIndicator from "../ProcessIndicator";
import Spinner from "../Spinner";
import Message from "./Message";
import { createSystemPrompt } from "../../store/currentProjectSlice";
import RenderCounter from "../RenderCounter";

function MessagesThread() {
  const {
    currentProjectState,
    currentProjectConversation,
    isLoadingCurrentProjectConversation,
    currentProjectConversationError,
    aiModelRequestInProgress,
    aiModelRequestError,
  } = useAppSelector((state: RootState) => state.currentProject);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const context = useAppSelector((state: RootState) => state.context);
  const { generalInstructions } = useAppSelector((state: RootState) => state.settings.instructions);
  const systemPrompt = useMemo(() => createSystemPrompt(context, generalInstructions, currentProjectState), [context, generalInstructions, currentProjectState]);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    setTimeout(scrollToBottom, 10);
  }, [currentProjectConversation?.length, aiModelRequestInProgress, aiModelRequestError]);

  return (
    <>
      <RenderCounter name="MessagesThread" />
      {isLoadingCurrentProjectConversation && <ProcessIndicator />}
      {currentProjectConversationError && <div className="flex p-4 items-center justify-center bg-red-500">{currentProjectConversationError}</div>}
      <div className="flex-1 overflow-x-auto overflow-y-scroll">
        <div className="pl-2 pt-2 pr-0.5 space-y-2 h-fit">
          <Message message={{ role: "system", content: systemPrompt }} />
          {currentProjectConversation?.map((message, index) => (
            <Message
              key={index}
              message={message as IMessage}
            />
          ))}
          {aiModelRequestInProgress && (
            <div className="flex justify-center items-center">
              <Spinner color="white" />
            </div>
          )}
          {aiModelRequestError && (
            <div className="flex-wrap justify-center">
              <div className="bg-red-100 text-red-800 px-2 py-2 rounded-md">
                {aiModelRequestError}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </>
  );
}

export default React.memo(MessagesThread);