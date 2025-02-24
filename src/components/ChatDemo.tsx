"use client";

import { useChat } from "@ai-sdk/react";

import { Chat } from "@/components/ui/chat";
import { ToggleChatDemoVisibility } from "@/App";
import { Brain, Close } from "./Icons";

export function ChatDemo() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop } =
    useChat({
      fetch: async (input, init) => {
        console.log("fetch log", {
          input,
          init,
          body: JSON.parse(init?.body as string),
        });
        const response = await fetch(input, init);

        return { input, init, response };
      },
    });

  return (
    <div className="flex flex-1 flex-col border-r border-0.5 min-w-[900px] h-full">
      <div className="flex pl-2 space-x-2 items-center justify-between border-b border-0.5">
        <div className="flex items-center space-x-2">
          <Brain className="w-8 h-8 font-light" />
          <h2 className="text-lg font-semibold">AI Demo Chat</h2>
        </div>
        <ToggleChatDemoVisibility>
          <Close className="h-12 w-12 p-2" />
        </ToggleChatDemoVisibility>
      </div>
      <div className="container flex flex-1 min-w-56">
        {/* <ChatThread
          messages={currentProjectMessages || []}
          isLoading={isLoadingCurrentProjectMessages}
          error={currentProjectMessagesError || undefined}
          aiModelRequestInProgress={aiModelRequestInProgress}
          aiModelRequestError={aiModelRequestError || undefined}
        /> */}
        {/* <Thread /> */}
        {/* <ChatInput
          inputValue={inputValue}
          onInputChange={(value) => dispatch(setInputValue(value))}
          onSendMessage={handleNewMessage}
          isLoading={aiModelRequestInProgress}
          currentProjectSettings={currentProjectSettings || undefined}
          isLoadingSettings={isLoadingCurrentProjectSettings}
          settingsError={currentProjectSettingsError || undefined}
          onServiceChange={handleServiceChange}
          onModelChange={handleModelChange}
          onAppendToInput={(text) => dispatch(appendToInputValue(text))}
          contextSettings={{
            instructions: instructionsInContext,
            descriptions: projectDescriptionsInContext,
            requirements: projectRequirementsInContext,
            tasks: projectTasksInContext,
            filePaths: projectFilePathsInContext,
          }}
          onContextChange={(key, value) => {
            dispatch(contextActions[key as ContextKey](value));
          }}
        /> */}
        <Chat
          messages={messages}
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isGenerating={isLoading}
          stop={stop}
          className="max-w-[960px] mx-auto pb-4 bg-slate-400/20"
        />
      </div>
    </div>
  );

  return (
    <div className="container flex mx-auto mb-4 min-w-56">
      <Chat
        messages={messages}
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isGenerating={isLoading}
        stop={stop}
      />
    </div>
  );
}
