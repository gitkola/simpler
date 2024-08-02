import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { IProjectState } from "../types";
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { syncProjectStateWithAIUpdates } from '../store/currentProjectSlice';
import { useAppDispatch } from '../store';
import Accordion from './Accordion';

export interface IMessageProjectStateUpdatesProps {
  projectStateUpdates: IProjectState;
}

export const MessageProjectStateUpdates: React.FC<IMessageProjectStateUpdatesProps> = ({ projectStateUpdates }) => {
  const dispatch = useAppDispatch();

  return (
    <Accordion
      title="Project State Updates"
      className="max-w-full rounded-md hover:border-gray-500"
      buttonClassName="rounded-md hover:border-gray-500"
      content={
        <div className="flex flex-col px-2 pb-2">
          <SyntaxHighlighter className="flex rounded-md max-w-[800px]" language={'json'} style={vscDarkPlus}>
            {JSON.stringify(projectStateUpdates, null, 2)}
          </SyntaxHighlighter>
          <button
            onClick={async () => await dispatch(syncProjectStateWithAIUpdates(projectStateUpdates))}
            className="flex w-fit bg-yellow-500 text-white font-bold py-1 px-2 rounded-md text-sm hover:bg-yellow-600"
          >
            Sync
          </button>
        </div>
      }
    />
  );
};