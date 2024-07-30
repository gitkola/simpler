import FileViewer from "./FileViewer";
import { useAppSelector } from '../store';
import TabsView, { TabContent } from './TabsView';

export default function SourceViewer() {
  const files = useAppSelector((state) => state.currentProject.currentProjectOpenedFiles);
  if (!files || files.length === 0) {
    return <div className="flex h-full items-center justify-center text-2xl">No files opened</div>;
  }

  return (
    <TabsView>
      {files.map((file) => (
        <TabContent path={file.path} key={file.path} isActive={!!file.isActive}>
          {
            !!file.isActive && <FileViewer path={file.path} />
          }
        </TabContent>
      ))}
    </TabsView>
  );
}