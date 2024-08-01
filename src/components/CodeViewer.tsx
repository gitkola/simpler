import FileViewer from "./FileViewer";
import { useAppSelector } from '../store';
import TabsView, { TabContent } from './TabsView';
import { CodeEditor } from "./Icons";
import ProcessIndicator from "./ProcessIndicator";

export default function CodeViewer() {
  const { currentProjectOpenedFiles, isLoadingCurrentProjectOpenedFiles, currentProjectOpenedFilesError } = useAppSelector((state) => state.currentProject);

  return (
    <div className="flex flex-col h-screen border-r-2 min-w-[800px] overflow-x-scroll">
      <div className="flex p-2 space-x-2 items-center justify-start border-b-2">
        <CodeEditor className="w-8 h-8" />
        <h2 className="text-lg font-semibold">File Viewer</h2>
      </div>
      {
        isLoadingCurrentProjectOpenedFiles && <ProcessIndicator />
      }
      {
        currentProjectOpenedFilesError && <div>{currentProjectOpenedFilesError}</div>
      }
      <TabsView>
        {currentProjectOpenedFiles.map((file) => (
          <TabContent path={file.path} key={file.path} isActive={!!file.isActive}>
            {
              !!file.isActive && <FileViewer path={file.path} />
            }
          </TabContent>
        ))}
      </TabsView>
    </div>
  );
}