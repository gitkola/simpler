import { Message, useChat } from "ai/react";
import { useState } from "react";
// import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
// import type CodeProps from "react-markdown"
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
// import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import { format } from "date-fns";
import { Button } from "../ui/button";
import { CheckIcon, CopyIcon } from "lucide-react";
import {
  ReasoningUIPart,
  TextUIPart,
  ToolInvocationUIPart,
} from "@ai-sdk/ui-utils";
import { MemoizedReactMarkdown } from "../ui/markdown";
import { CodeBlock } from "../ui/codeblock";
import { Skeleton } from "../ui/skeleton";
import { RootState, useAppSelector } from "@/store";

export const Thread = () => {
  const {
    // currentProjectState,
    currentProjectConversation,
    // isLoadingCurrentProjectConversation,
    // currentProjectConversationError,
    // aiModelRequestInProgress,
    // aiModelRequestError,
  } = useAppSelector((state: RootState) => state.currentProject);
  const { messages, input, setInput, append, isLoading } = useChat({
    api: "/api/chat",
    initialMessages: currentProjectConversation,
  });
  console.log({ messages: messages.map((m) => m.parts) });
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void append({ content: input, role: "user" });
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };
  return (
    <div className="flex flex-col gap-4 p-2 overflow-x-auto overflow-y-auto">
      {messages.map((message, index) => (
        <div
          key={index}
          className="flex flex-col items-start w-full border border-gray-200/20 rounded-md"
        >
          <div className="flex items-center justify-between m-2">
            {/* <Avatar>
                <AvatarImage src={message.role === "user" ? "/user-avatar.png" : "/ai-avatar.png"} />
                <AvatarFallback>{message.role === "user" ? "U" : "A"}</AvatarFallback>
            </Avatar> */}
            <div className="flex items-center gap-2">
              <span className="font-semibold">{message.role}</span>
              <span className="text-xs text-muted-foreground">
                {format(new Date(), "yyyy-MM-dd HH:mm")}
              </span>
            </div>
            <Button
              variant="secondary"
              size="icon"
              className="w-6 h-6 ml-2"
              onClick={() => copyToClipboard(String(message.content), index)}
            >
              {copiedIndex === index ? (
                <CheckIcon size={16} className="text-green-500" />
              ) : (
                <CopyIcon size={16} />
              )}
              <span className="sr-only">
                {copiedIndex === index ? "Copied!" : "Copy message"}
              </span>
            </Button>
          </div>
          <div className="flex-1 w-full">
            <div className="p-2 break-words prose prose-sm dark:prose-invert max-w-none">
              <MemoizedReactMarkdown
                components={{
                  code: ({ node, inline, className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || "");
                    // console.log({ children })
                    return !inline && match ? (
                      <CodeBlock
                        {...props}
                        language={match[1]}
                        value={children as string}
                      />
                    ) : (
                      <code
                        {...props}
                        className="bg-teal-500/50 dark:bg-teal-500/50 rounded px-1 py-0.5"
                      >
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {getMessageParts(message)}
              </MemoizedReactMarkdown>
            </div>
            {/* <Button
            variant="ghost"
            size="icon"
            className="mt-1"
            onClick={() => copyToClipboard(String(message.content), index)}
          >
            {copiedIndex === index ? <CheckIcon size={16} className="text-green-500" /> : <CopyIcon size={16} />}
            <span className="sr-only">{copiedIndex === index ? "Copied!" : "Copy message"}</span>
          </Button> */}
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="flex justify-center">
          <Skeleton color="white" />
        </div>
      )}
    </div>
  );
};
//parts?: Array<TextUIPart | ReasoningUIPart | ToolInvocationUIPart>
// type ToolInvocation = ({
//     state: 'partial-call';
//     step?: number;
// } & ToolCall<string, any>) | ({
//     state: 'call';
//     step?: number;
// } & ToolCall<string, any>) | ({
//     state: 'result';
//     step?: number;
// } & ToolResult<string, any, any>);
const getMessageParts = (message: Message) => {
  if (Array.isArray(message.parts)) {
    return message.parts
      .map(
        (
          part:
            | { type: "text"; text: string | TextUIPart[] }
            | TextUIPart
            | ReasoningUIPart
            | ToolInvocationUIPart
        ) => {
          if (part.type === "text") {
            return getTextFromTextUIPart(part);
          }
          if (part.type === "reasoning") {
            return `\n**Reasoning:**\n${part.reasoning}\n`;
          }
          if (part.type === "tool-invocation") {
            return `\n\`\`\`json\n${JSON.stringify(
              part.toolInvocation,
              null,
              2
            )}\n\`\`\``;
          }
          return "";
        }
      )
      .join("\n");
  }
};

const getTextFromTextUIPart = (
  part: TextUIPart | { type: "text"; text: string | TextUIPart[] }
) => {
  if (typeof part.text === "string") {
    return part.text;
  }
  if (Array.isArray(part.text)) {
    return part.text.map(({ text }) => text).join("\n");
  }
  return JSON.stringify(part.text, null, 2);
};
