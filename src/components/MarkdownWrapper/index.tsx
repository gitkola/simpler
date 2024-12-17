import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components } from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import * as prism from "react-syntax-highlighter/dist/esm/styles/prism";
import { Separator } from "@radix-ui/react-select";
import './markdown.css';
import { parseFilePathFromFirstLine } from '../../utils/pathUtils';
import { CopyButton, SaveButton } from '../Buttons/ButtonsWithFeedback';

const Markdown: React.FC<{ children: any }> = ({ children }) => {

  const components: Components = {
    code({ className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      const isInline = !match;

      const filePath = parseFilePathFromFirstLine(children as string);

      return isInline ? (
        <code className={`${className} bg-green-500 bg-opacity-50 pb-0.5 px-1 rounded-sm`} {...props}>
          {children}
        </code>
      ) : (
        <div className="bg-gray-600 rounded-md justify-start">
          <SyntaxHighlighter style={prism.atomDark} language={match[1]} PreTag="pre" wrapLines wrapLongLines>
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
          <div className="flex flex-row gap-4 items-center justify-start px-2 pb-2">
            <CopyButton text={String(children).replace(/\n$/, "")} />
            {filePath && <SaveButton content={String(children).replace(/\n$/, "")} path={filePath} />}
          </div>
        </div>
      );
    },
    p({ children }) {
      return <p className="py-4 text-wrap">{children}</p>;
    }
  };
  return (
    <div className="markdown-content space-y-4">
      <ReactMarkdown className="text-wrap font-mono" components={components}>
        {children}
      </ReactMarkdown>
      <Separator style={{ height: 1, marginTop: 16, marginBottom: 24, backgroundColor: '#CCCCCC22' }} />
      <CopyButton text={children} />
    </div>
  );
};

export default Markdown;