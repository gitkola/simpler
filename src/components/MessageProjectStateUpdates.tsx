import { IProjectState } from "../types";
import { syncProjectStateWithAIUpdates } from '../store/currentProjectSlice';
import { useAppDispatch } from '../store';
import Accordion from './Accordion';
import Editor from './Editor';

export interface IMessageProjectStateUpdatesProps {
  projectStateUpdates: IProjectState;
}

export const MessageProjectStateUpdates: React.FC<IMessageProjectStateUpdatesProps> = ({ projectStateUpdates }) => {
  const dispatch = useAppDispatch();

  return (
    <Accordion
      title="Project State Updates"
      className="shadow-none max-w-full rounded-md py-0 hover:border-gray-500 bg-opacity-20"
      buttonClassName="shadow-none rounded-md py-0 hover:border-gray-500"
      content={
        <div className="flex flex-col px-2 pb-2">
          <Editor
            value={JSON.stringify(projectStateUpdates, null, 2)}
            language={'json'}
            minHeight={24}
            style={{
              marginLeft: 25,
              lineHeight: 1.6,
            }}
            disabled={true}
          />
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