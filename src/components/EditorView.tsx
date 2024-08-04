import FileViewer from "./FileViewer";
import { useAppDispatch, useAppSelector } from '../store';
import TabsView, { TabContent } from './TabsView';
import { CodeEditor, Diff } from "./Icons";
import ProcessIndicator from "./ProcessIndicator";
import { setShowDiff } from "../store/settingsSlice";

export default function EditorView() {
  const showDiff = useAppSelector((state) => state.settings.showDiff);
  const dispatch = useAppDispatch();
  const { currentProjectOpenedFiles, isLoadingCurrentProjectOpenedFiles, currentProjectOpenedFilesError } = useAppSelector((state) => state.currentProject);
  return (
    <div className="flex flex-col h-screen border-r border-0.5 min-w-[900px] overflow-x-scroll">
      <div className="flex p-2 space-x-2 items-center justify-start border-b border-0.5">
        <button className={`flex space-x-2 items-center justify-start ${!showDiff ? '' : 'opacity-30'}`} onClick={() => dispatch(setShowDiff(false))}>
          <CodeEditor className="w-8 h-8" />
          <h2 className="text-lg font-semibold">File View</h2>
        </button>
        <button className={`flex space-x-2 items-center justify-start ${showDiff ? '' : 'opacity-30'}`} onClick={() => dispatch(setShowDiff(true))}>
          <Diff className="w-8 h-8" />
          <h2 className="text-lg font-semibold">Compare View</h2>
        </button>
      </div>
      {isLoadingCurrentProjectOpenedFiles && <ProcessIndicator />}
      {currentProjectOpenedFilesError && <div className="flex px-2 py-1 mx-auto mt-16 text-red-700 bg-red-300 border border-red-700 rounded-md">{currentProjectOpenedFilesError}</div>}
      {!isLoadingCurrentProjectOpenedFiles && <TabsView>
        {currentProjectOpenedFiles.map((file) => (
          <TabContent path={file.path} key={file.path} isActive={!!file.isActive}>
            {
              !!file.isActive && (<FileViewer showDiff={showDiff} path={file.path} />)
            }
          </TabContent>
        ))}
      </TabsView>}
    </div>
  );
}