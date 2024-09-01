import { CoreToolMessage } from "ai";
import { IProjectFile, IProjectState } from "../../types";
import Accordion from "../Accordion";
import Editor from "../Editor";
import Markdown from "../MarkdownWrapper";
import AppIcon from "../Icons";
import { useAppDispatch } from "../../store";
import { handleSendMessageWithAISDK } from "../../store/currentProjectSlice";
import { getFileExtension } from "../../utils/pathUtils";

interface IGetProjectStateFilesResult {
  files: IProjectFile[];
}

interface IUpdateProjectStateResult {
  PartialProjectState: IProjectState;
}

export default function ToolMessage({ message }: { message: CoreToolMessage }) {
  const dispatch = useAppDispatch();
  const content = message?.content;
  const renderUpdateProjectStateResult = (result: IUpdateProjectStateResult) => (<>
    {
      <Accordion
        title={'PartialProjectState'}
        titleClassName="text-lg font-bold border-b-2 border-b-blue-500"
        buttonClassName=""
        content={
          <Editor language={"json"} value={JSON.stringify(result.PartialProjectState!, null, 2)} disabled style={{ padding: 8 }} />
        }
      />
    }
  </>);
  const renderGetProjectStateFilesResult = (result: IGetProjectStateFilesResult) => (<>
    {
      Array.isArray(result?.files) && result.files.map((file: IProjectFile, idx: number) => {
        return (
          <Accordion
            key={idx}
            title={file.path}
            titleClassName="text-lg font-bold border-b-2 border-b-blue-500"
            buttonClassName=""
            content={
              <Editor language={getFileExtension(file.path)} value={file.content!} disabled style={{ padding: 8 }} />
            }
          />
        );
      })
    }
  </>);

  return (
    <div className={`flex flex-col w-full p-2 rounded-md bg-yellow-500 bg-opacity-50 select-text space-y-2`}>
      <h1 className="text-2xl font-bold space-x-2 capitalize">{message.role} <button onClick={() => dispatch(handleSendMessageWithAISDK())} className="bg-blue-500 hover:bg-blue-600 text-white pl-3 pr-2 rounded-full"><div className="flex space-x-4"><span>Send Tools Result</span> <AppIcon icon="arrow-up" /></div></button></h1>
      <div className="flex flex-col w-vw">
        <div className="flex flex-col w-vw gap-8">
          {Array.isArray(content) &&
            <>
              {
                content.map((contentItem, index) => {
                  return (
                    <div key={index}>
                      <Markdown>{`## ${contentItem.toolName}`}</Markdown>
                      {(contentItem.toolName === "getProjectStateFiles") && renderGetProjectStateFilesResult(contentItem.result as IGetProjectStateFilesResult)}
                      {(contentItem.toolName === "updateProjectState") && renderUpdateProjectStateResult(contentItem.result as IUpdateProjectStateResult)}
                    </div>
                  );
                })
              }
            </>
          }
        </div>
      </div>
      <Accordion
        title="Raw message"
        titleClassName="text-xs"
        content={
          <div
            style={{ whiteSpace: 'pre-wrap' }}
            className="text-xs"
          >
            {JSON.stringify(message, null, 2)}
          </div>
        }
      />
    </div >
  );
}