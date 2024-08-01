import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { ChevronDown, ChevronRight } from "./Icons";
import { IProjectState } from "../types";
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useState } from "react";
import { syncProjectStateWithAIUpdates } from '../store/currentProjectSlice';
import { useAppDispatch } from '../store';

export interface IMessageProjectStateUpdatesProps {
  projectStateUpdates: IProjectState;
}

export const MessageProjectStateUpdates: React.FC<IMessageProjectStateUpdatesProps> = ({ projectStateUpdates }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const dispatch = useAppDispatch();
  return (
    <div className="flex flex-col bg-gray-400 justify-between rounded-md">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex px-2 py-1 items-center justify-between rounded-md hover:bg-gray-400 hover:shadow-md"
      >
        <div className="font-bold">Project State Updates</div>
        {!isExpanded ? (
          <ChevronRight size={24} />
        ) : (
          <ChevronDown size={24} />
        )}
      </button>
      {isExpanded && (
        <div className="flex flex-col px-2 pb-2">
          <SyntaxHighlighter className="flex rounded-md max-w-[800px]" language={'json'} style={vscDarkPlus}>
            {JSON.stringify(projectStateUpdates, null, 2)}
          </SyntaxHighlighter>
          <button
            onClick={async () => await dispatch(syncProjectStateWithAIUpdates(projectStateUpdates))}
            className="flex w-fit bg-yellow-500 text-white font-bold py-1 px-2 rounded-md text-sm hover:bg-blue-600"
          >
            Sync
          </button>
        </div>
      )}
    </div>
  );
};