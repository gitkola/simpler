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
      content={
        <div className="space-y-2">
          <Editor
            value={JSON.stringify(projectStateUpdates, null, 2)}
            language={'json'}
            minHeight={24}
            style={{
              lineHeight: 1.6,
            }}
            disabled={true}
          />
          <button
            onClick={async () => await dispatch(syncProjectStateWithAIUpdates(projectStateUpdates))}
            className="bg-yellow-500 text-white font-bold py-1 px-2 rounded-md text-sm hover:bg-yellow-600"
          >
            Sync to ProjectState
          </button>
        </div>
      }
    />
  );
};