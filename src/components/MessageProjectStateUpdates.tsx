import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { ChevronDown, ChevronRight } from "./Icons";
import { IProjectState } from "../types";
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useState } from "react";

export interface IMessageProjectStateUpdatesProps {
  content: IProjectState;
  onPressSync: (value: IProjectState) => void;
}

export const MessageProjectStateUpdates: React.FC<IMessageProjectStateUpdatesProps> = ({ content, onPressSync }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className="p-2 bg-yellow-300 rounded-md mt-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex flex-row items-center w-full hover:text-gray-600"
      >
        <div className="text-lg font-bold">Project State Updates</div>
        {isExpanded ? (
          <ChevronRight size={24} />
        ) : (
          <ChevronDown size={24} />
        )}
      </button>
      {isExpanded && (
        <>
          <SyntaxHighlighter className="no-scrollbar rounded-md" language={'json'} style={vscDarkPlus}>
            {JSON.stringify(content, null, 2)}
          </SyntaxHighlighter>
          <button
            onClick={() => onPressSync(content)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm mr-2"
          >
            Sync
          </button>
        </>
      )}
    </div>
  );
};