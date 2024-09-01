import { IBaseMessage, IProjectFile } from "../../types";
import Accordion from "../Accordion";
import Editor from "../Editor";
import Markdown from "../MarkdownWrapper";

export default function ToolMessage({ message }: { message: IBaseMessage }) {
  // console.log(message);

  const content = message?.content;
  // const content = JSON.stringify(message?.content, null, 2);
  return (
    <div className={`flex flex-col w-full p-2 rounded-md bg-yellow-500 bg-opacity-50 select-text space-y-2`}>
      <h1 className="text-2xl font-bold">{message.role}</h1>
      <div className="flex flex-col w-vw">
        {typeof content === 'string' && <Markdown>{content}</Markdown>}
        <div className="flex flex-col w-vw gap-2">
          {Array.isArray(content) &&
            <>
              {
                content.map((contentItem, index) => {
                  return (
                    <div key={index} className="rounded">
                      <p><span className="font-bold">{contentItem.type}:</span> {contentItem.toolName}</p>
                      {
                        Array.isArray(contentItem.result?.files) && contentItem.result?.files.map((file: IProjectFile, idx: number) => {
                          return (
                            <div key={idx}>
                              <h2>{file.path}</h2>
                              <Editor language="typescript" value={file.content} />
                            </div>
                          );
                        })
                      }
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