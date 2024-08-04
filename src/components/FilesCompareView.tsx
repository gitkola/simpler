import CompareViewer from "./CompareViewer";
import TabsView, { TabContent } from './TabsView';
import { Diff } from "./Icons";
import ProcessIndicator from "./ProcessIndicator";
import { useAppSelector } from "../store";
import SquareButton from "./SquareButton";

export default function FilesCompareView() {
  const { currentProjectOpenedFiles, isLoadingCurrentProjectOpenedFiles, currentProjectOpenedFilesError } = useAppSelector((state) => state.currentProject);

  return (
    <div className="flex flex-col h-screen border-r border-0.5 min-w-[800px] overflow-x-scroll">
      <div className="flex p-2 space-x-2 items-center justify-between border-b border-0.5">
        <div className="flex">
          <Diff className="w-8 h-8" />
          <h2 className="text-lg font-semibold">Compare View</h2>
        </div>
        <SquareButton icon="edit" onClick={() => { }} className="w-8 h-8 " />
      </div>
      {isLoadingCurrentProjectOpenedFiles && <ProcessIndicator />}
      {currentProjectOpenedFilesError && <div>{currentProjectOpenedFilesError}</div>}
      <TabsView>
        {
          currentProjectOpenedFiles.map((file) => (
            <TabContent path={file.path} key={file.path} isActive={!!file.isActive}>
              {!!file.isActive && <CompareViewer path={file.path} />}
            </TabContent>
          ))
        }
      </TabsView>
    </div>
  );
}
