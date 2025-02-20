"use client";

import { useChat } from "@ai-sdk/react";

import { Chat } from "@/components/ui/chat";

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
