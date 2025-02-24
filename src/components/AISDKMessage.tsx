import React, { ComponentPropsWithoutRef, useState } from "react";
import { JSONValue, Message } from "@ai-sdk/ui-utils";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Markdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { JsonView } from "./json-view";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Check, Copy } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import * as prism from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
  AccordionItem,
} from "./ui/accordion";
import { Select } from "./Select";
import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";

export const syntaxHighlightStyleAtom = atomWithStorage<string>(
  "syntax-highlight-style",
  "vscDarkPlus"
);

interface AISDKMessageProps {
  message: Message;
  className?: string;
}

/**
Typed tool call that is returned by generateText and streamText.
It contains the tool call ID, the tool name, and the tool arguments.
 */
interface ToolCall<NAME extends string, ARGS> {
  /**
ID of the tool call. This ID is used to match the tool call with the tool result.
 */
  toolCallId: string;
  /**
Name of the tool that is being called.
 */
  toolName: NAME;
  /**
Arguments of the tool call. This is a JSON-serializable object that matches the tool's input schema.
   */
  args: ARGS;
}

/**
Typed tool result that is returned by `generateText` and `streamText`.
It contains the tool call ID, the tool name, the tool arguments, and the tool result.
*/
interface ToolResult<NAME extends string, ARGS, RESULT> {
  /**
ID of the tool call. This ID is used to match the tool call with the tool result.
   */
  toolCallId: string;
  /**
Name of the tool that was called.
   */
  toolName: NAME;
  /**
Arguments of the tool call. This is a JSON-serializable object that matches the tool's input schema.
     */
  args: ARGS;
  /**
Result of the tool call. This is the result of the tool's execution.
     */
  result: RESULT;
}

/**
Tool invocations are either tool calls or tool results. For each assistant tool call,
there is one tool invocation. While the call is in progress, the invocation is a tool call.
Once the call is complete, the invocation is a tool result.

The step is used to track how to map an assistant UI message with many tool invocations
back to a sequence of LLM assistant/tool result message pairs.
It is optional for backwards compatibility.
 */
type ToolInvocation =
  | ({
      state: "partial-call";
      step?: number;
    } & ToolCall<string, any>)
  | ({
      state: "call";
      step?: number;
    } & ToolCall<string, any>)
  | ({
      state: "result";
      step?: number;
    } & ToolResult<string, any, any>);

// interface ToolInvocation {
//   name: string;
//   input: any;
//   output: any;
//   state: string;
//   step: number | undefined;
// }

/**
 * Additional provider-specific metadata. They are passed through
 * to the provider from the AI SDK and enable provider-specific
 * functionality that can be fully encapsulated in the provider.
 *
 * This enables us to quickly ship provider-specific functionality
 * without affecting the core AI SDK.
 *
 * The outer record is keyed by the provider name, and the inner
 * record is keyed by the provider-specific metadata key.
 *
 * ```ts
 * {
 *   "anthropic": {
 *     "cacheControl": { "type": "ephemeral" }
 *   }
 * }
 * ```
 */
type LanguageModelV1ProviderMetadata = Record<
  string,
  Record<string, JSONValue>
>;

/**
 * A source that has been used as input to generate the response.
 */
type LanguageModelV1Source = {
  /**
   * A URL source. This is return by web search RAG models.
   */
  sourceType: "url";
  /**
   * The ID of the source.
   */
  id: string;
  /**
   * The URL of the source.
   */
  url: string;
  /**
   * The title of the source.
   */
  title?: string;
  /**
   * Additional provider metadata for the source.
   */
  providerMetadata?: LanguageModelV1ProviderMetadata;
};

// interface LanguageModelV1Source {
//   sourceType: string;
//   url: string;
//   title: string;
// }

const RoleIcon = {
  system: "⚙️",
  user: "👤",
  assistant: "🤖",
  data: "📊",
};

interface CodeProps extends ComponentPropsWithoutRef<"code"> {
  inline?: boolean;
}

export const CodeBlock = ({
  language,
  content,
}: {
  language: string;
  content: string;
}) => {
  const [copied, setCopied] = useState(false);
  const [style, setStyle] = useAtom(syntaxHighlightStyleAtom);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };
  return (
    <div className="not-prose relative pb-4 w-full last:mb-0">
      <div className="overflow-hidden">
        <div className="flex items-center justify-between px-4 py-1 bg-gray-500/50 text-white">
          <span className="font-medium">{language}</span>
          <Select
            name="style"
            value={style}
            onChange={(e) => setStyle(e.target.value as string)}
            options={Object.keys(prism)}
          />
          <TooltipProvider>
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-1 hover:text-zinc-200 transition-colors"
                >
                  {copied ? (
                    <div className="flex items-center gap-1.5">
                      <Check className="h-3.5 w-3.5" />
                      Copied
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <Copy className="h-3.5 w-3.5" />
                      Copy
                    </div>
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy to clipboard</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <div className="overflow-hidden w-full border border-gray-500/50">
        <SyntaxHighlighter
          // @ts-ignore
          style={prism[style] || prism.vscDarkPlus}
          language={language}
          PreTag="div"
          customStyle={{
            margin: 0,
            background: "transparent",
            padding: "0.75rem 1rem",
            fontSize: "0.875rem",
            lineHeight: "1.5",
            whiteSpace: "pre-wrap",
          }}
          codeTagProps={{
            style: {
              fontSize: "inherit",
              lineHeight: "inherit",
            },
          }}
        >
          {content}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

const components: Components = {
  p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
  h1: ({ children }) => (
    <h1 className="text-2xl font-bold mb-2 mt-4">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-xl font-bold mb-2 mt-4">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-lg font-bold mb-2 mt-4">{children}</h3>
  ),
  ul: ({ children }) => (
    <ul className="list-disc ml-5 mb-3 last:mb-0 space-y-1">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal ml-9 mb-3 last:mb-0 space-y-1">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => <strong className="font-bold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-gray-300 pl-4 my-3 italic">
      {children}
    </blockquote>
  ),
  code: ({ inline, className, children }: CodeProps) => {
    const match = /language-(\w+)/.exec(className || "");

    if (inline) {
      return (
        <code className="px-1 py-0.5 rounded-md bg-teal-500 font-mono">
          {children}
        </code>
      );
    }

    const content = String(children).replace(/\n$/, "");
    const shouldBeCodeBlock =
      !inline && (content.includes("\n") || content.length > 50 || match);

    if (shouldBeCodeBlock) {
      const language = match ? match[1] : "";
      return <CodeBlock language={language} content={content} />;
    }

    return (
      <code className="px-1 py-0.5 rounded-sm bg-teal-500/50 font-mono">
        {children}
      </code>
    );
  },
};

const SimpleMarkdown: React.FC<{ children: string }> = ({ children }) => {
  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      className="proses dark:prose-invert text-wrap w-full"
      components={components}
    >
      {children}
    </Markdown>
  );
};

const TextPart: React.FC<{ content: string }> = ({ content }) => {
  return <SimpleMarkdown>{content}</SimpleMarkdown>;
};

const ReasoningPart: React.FC<{ content: string }> = ({ content }) => {
  return (
    <div className="mt-2 text-sm text-muted-foreground">
      <Badge variant="outline" className="mb-1">
        Reasoning
      </Badge>
      <SimpleMarkdown>{content}</SimpleMarkdown>
    </div>
  );
};

const ToolInvocationPart: React.FC<{ invocation: ToolInvocation }> = ({
  invocation,
}) => {
  const isResult = invocation.state === "result";

  return (
    <div className="mt-2 text-sm">
      <Badge variant="outline" className="mb-1">
        Tool {invocation.state}{" "}
        {invocation.step !== undefined && `(Step ${invocation.step})`}
      </Badge>
      <Card className="p-3">
        <div className="font-mono text-sm">{invocation.state}</div>
        <div className="mt-2">
          <div className="text-xs text-muted-foreground">Input:</div>
          {/* <SimpleMarkdown>{`\`\`\`json\n${JSON.stringify(
            invocation.input,
            null,
            2
          )}\n\`\`\``}</SimpleMarkdown> */}
          <JsonView src={invocation} name="input" />
        </div>
        {isResult && invocation && (
          <div className="mt-2">
            <div className="text-xs text-muted-foreground">Output:</div>
            {/* <SimpleMarkdown>{`\`\`\`json\n${JSON.stringify(
              invocation.output,
              null,
              2
            )}\n\`\`\``}</SimpleMarkdown> */}
            <JsonView src={invocation} name="output" />
          </div>
        )}
      </Card>
    </div>
  );
};

const SourcePart: React.FC<{ source: LanguageModelV1Source | string }> = ({
  source,
}) => {
  // Try to parse the source as a LanguageModelV1Source
  try {
    return <JsonView src={source as LanguageModelV1Source} name="source" />;
    // const sourceObj = source;
    // if (sourceObj.sourceType === "url") {
    //   return (
    //     <div className="mt-2">
    //       <Badge variant="outline" className="mb-1">
    //         Source {sourceObj.title || sourceObj.url}
    //       </Badge>
    //       <Card className="p-3">
    //         <div className="space-y-2">
    //           <a
    //             href={sourceObj.url}
    //             target="_blank"
    //             rel="noopener noreferrer"
    //             className="text-blue-500 hover:underline break-all"
    //           >
    //             {sourceObj.url}
    //           </a>
    //           {sourceObj.title && (
    //             <div className="text-sm text-muted-foreground">
    //               {sourceObj.title}
    //             </div>
    //           )}
    //         </div>
    //       </Card>
    //     </div>
    //   );
    // }
  } catch (e) {
    // If parsing fails, treat it as plain text
  }

  // Fallback to plain text display
  return (
    <div className="mt-2">
      <Badge variant="outline" className="mb-1">
        Source
      </Badge>
      <Card className="p-3">
        <SimpleMarkdown>{source as string}</SimpleMarkdown>
      </Card>
    </div>
  );
};

export const ToolUseContent = ({
  content,
}: {
  content: { id: string; name: string; type: "tool_use"; input: any };
}) => {
  return (
    <div className="mt-2 overflow-hidden">
      <div className="py-4 gap-2 flex">
        <Badge
          variant="outline"
          className="mb-1 bg-yellow-500 shadow-yellow-500 shadow"
        >
          Tool Use
        </Badge>
        <Badge
          variant="outline"
          className="mb-1 bg-yellow-500 shadow-yellow-500 shadow"
        >
          {content.id}
        </Badge>
        <Badge
          variant="outline"
          className="mb-1 bg-yellow-500 shadow-yellow-500 shadow"
        >
          {content.name}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col">
        {typeof content.input === "string" ? (
          <SimpleMarkdown>{content.input as string}</SimpleMarkdown>
        ) : (
          <JsonView
            src={content.input}
            name="input"
            styles={{
              width: "100%",
            }}
          />
        )}
      </div>
    </div>
  );
};

export function AISDKMessage({ message, className }: AISDKMessageProps) {
  const [accordionValue, setAccordionValue] = React.useState<
    string | undefined
  >("opened");

  return (
    <Accordion
      type="single"
      collapsible
      value={accordionValue}
      onValueChange={setAccordionValue}
      className={cn(
        "font-mono font-extralight w-full max-w-4xl m-0 p-0 mx-auto relative group border-r border-l border-b",
        className
      )}
    >
      <div
        className="absolute right-0 top-0 w-4 h-full cursor-pointer hover:bg-gray-500/10 z-10"
        onClick={() =>
          setAccordionValue(accordionValue === "opened" ? "closed" : "opened")
        }
      />
      <div
        className="absolute left-0 top-0 w-4 h-full cursor-pointer hover:bg-gray-500/10 z-10"
        onClick={() =>
          setAccordionValue(accordionValue === "opened" ? "closed" : "opened")
        }
      />
      <AccordionItem value="opened" className="m-0 p-0 w-full relative">
        <div className="">
          <div className="pointer-events-none">
            <AccordionTrigger className="w-full group-hover:no-underline m-0 px-4 pointer-events-auto hover:bg-gray-500/10">
              <div className="font-mono font-extralight flex w-full items-center">
                <Avatar className="h-4 w-4 items-center justify-center">
                  <div className="flex h-full w-full items-center justify-center">
                    {RoleIcon[message.role] || "❔"}{" "}
                  </div>
                </Avatar>
                <div className="ml-2 flex-1 overflow-hidden">
                  <div className="text-sm">
                    {message.role}{" "}
                    {message.role === "assistant" &&
                      (message as Message & { model: string }).model}
                  </div>
                </div>
              </div>
            </AccordionTrigger>
          </div>
        </div>
        <AccordionContent className="m-0 px-4 pt-4 relative ">
          <div className="pointer-events-auto">
            {/* Legacy content/reasoning support */}
            {!message.parts &&
              message.content &&
              (Array.isArray(message.content) ? (
                <>
                  {message.content.map((contentItem, index) => {
                    if (contentItem.type === "text") {
                      return (
                        <TextPart key={index} content={contentItem.text} />
                      );
                    } else if (contentItem.type === "reasoning") {
                      return (
                        <ReasoningPart
                          key={index}
                          content={contentItem.reasoning}
                        />
                      );
                    } else if (contentItem.type === "tool_use") {
                      return (
                        <ToolUseContent key={index} content={contentItem} />
                      );
                    } else if (contentItem.type === "source") {
                      return (
                        <SourcePart key={index} source={contentItem.source} />
                      );
                    } else {
                      return (
                        <TextPart
                          key={index}
                          content={JSON.stringify(contentItem, null, 2)}
                        />
                      );
                    }
                  })}
                </>
              ) : (
                <TextPart content={message.content} />
              ))}
            {!message.parts && message.reasoning && (
              <ReasoningPart content={message.reasoning} />
            )}
            {/* {!message.parts &&
              message.toolInvocations?.map((invocation, i) => (
                <ToolInvocationPart key={i} invocation={invocation} />
              ))} */}

            {/* Modern parts-based rendering */}
            {message.parts?.map((part, index) => {
              switch (part.type) {
                case "text":
                  return <TextPart key={index} content={part.text} />;
                case "reasoning":
                  return <ReasoningPart key={index} content={part.reasoning} />;
                case "tool-invocation":
                  return (
                    <ToolInvocationPart
                      key={index}
                      invocation={part.toolInvocation}
                    />
                  );
                case "source":
                  return <SourcePart key={index} source={part.source} />;
                default:
                  return null;
              }
            })}

            {/* Attachments */}
            {message.experimental_attachments?.map((attachment, i) => (
              <Card key={i} className="p-3">
                <pre className="text-sm">
                  {JSON.stringify(attachment, null, 2)}
                </pre>
              </Card>
            ))}
            <JsonView
              src={message}
              name={"raw"}
              collapsed
              styles={{ paddingTop: 16 }}
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
