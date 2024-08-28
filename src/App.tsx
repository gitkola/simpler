import React, { useEffect } from "react";
// import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import SidePanel from "./components/SidePanel";
import EditorView from "./components/EditorView";
import ProjectInfoView from "./components/ProjectInfoView";
import { ChatView } from "./components/ChatView";
import { RootState, useAppDispatch, useAppSelector } from "./store";
import { loadProject } from "./store/currentProjectSlice";
import ProjectListView from "./components/ProjectListView";
import FileTreeView from "./components/FileTreeView";
import SettingsView from "./components/SettingsView";
import { StyleTag } from "./styles/styles";
import ProjectStateView from "./components/ProjectStateView";
import ProjectMessagesView from "./components/ProjectMessagesView";
import ModalFileContent from "./components/ModalFileContent";
import ProjectFilesView from "./components/ProjectFilesView";
import { ThreadView } from "./components/ThreadView";
// import FileTreeView2 from "./components/FileTreeView2";
// import FileTreeView3 from "./components/FileTreeView3";
// import { resizeHandle } from "./styles/styles";

const App: React.FC = () => {
  const activeProjectPath = useAppSelector((state: RootState) => state.projects.activeProjectPath);
  const { fileInModal } = useAppSelector((state: RootState) => state.layout);
  const dispatch = useAppDispatch();

  const loadProjectData = async () => {
    await dispatch(loadProject());
  };

  useEffect(() => {
    if (!activeProjectPath) return;
    loadProjectData();
  }, [activeProjectPath]);
  const { showProjects, showProjectFiles, showFileTree, showSettings, showCodeEditor, showChat, showThread, showProjectState, showProjectInfo, showProjectMessages } = useAppSelector((state) => state.layout);
  // const fileTree = useAppSelector((state) => state.fileTree);
  // const flatFileTree = useAppSelector((state) => state.flatFileTree);
  // console.log({ fileTree, flatFileTree });


  return (
    <div className="flex h-screen">
      <StyleTag />
      <SidePanel />
      <div className="flex overflow-x-scroll overflow-y-hidden">
        <div className="flex">
          {showProjects && <ProjectListView />}
          {showProjectInfo && <ProjectInfoView />}
          {showProjectState && <ProjectStateView />}
          {showProjectMessages && <ProjectMessagesView />}
          {showProjectFiles && <ProjectFilesView />}
          {showFileTree && <FileTreeView />}
          {/* {showFileTree && <FileTreeView2 />}
          {showFileTree && <FileTreeView3 />} */}
          {showCodeEditor && <EditorView />}
          {showChat && <ChatView />}
          {showThread && <ThreadView />}
          {showSettings && <SettingsView />}
        </div>
      </div>
      {fileInModal && <ModalFileContent />}
    </div>
  );

  // return (
  //   <div className="flex h-screen w-screen">
  //     <SidePanel />
  //     <PanelGroup
  //       // autoSaveId="conditional"
  //       direction="horizontal"
  //     // className="h-screen w-screen overflow-auto"
  //     >
  //       {
  //         showProjects && (
  //           <>
  //             <Panel
  //               id="projects"
  //               // minSize={12}
  //               // maxSize={16}
  //               order={1}
  //             >
  //               <ProjectListView />
  //             </Panel>
  //             <PanelResizeHandle className={`${resizeHandle}`} />
  //           </>
  //         )
  //       }
  //       {
  //         showProjectState && (
  //           <>
  //             <Panel
  //               id="project-info"
  //               // minSize={16}
  //               // maxSize={24}
  //               order={2}
  //             >
  //               <ProjectInfoView />
  //             </Panel>
  //             <PanelResizeHandle className={`${resizeHandle}`} />
  //           </>
  //         )
  //       }
  //       {
  //         showFileTree && (
  //           <>
  //             <Panel
  //               id="file-tree"
  //               // minSize={12}
  //               // maxSize={32}
  //               order={3}
  //             >
  //               <FileTreeView />
  //             </Panel>
  //             <PanelResizeHandle className={`${resizeHandle}`} />
  //           </>
  //         )
  //       }
  //       {
  //         showCodeEditor && (
  //           <>
  //             <Panel
  //               id="code-editor"
  //               // minSize={24}
  //               // maxSize={32}
  //               order={4}
  //             >
  //               <EditorView />
  //             </Panel>
  //             <PanelResizeHandle className={`${resizeHandle}`} />
  //           </>
  //         )
  //       }
  //       {
  //         showChat && (
  //           <>
  //             <Panel
  //               id="messages"
  //               // minSize={24}
  //               // maxSize={32}
  //               order={5}
  //             >
  //               <ChatView />
  //             </Panel>
  //             <PanelResizeHandle className={`${resizeHandle}`} />
  //           </>
  //         )
  //       }
  //       {
  //         showSettings && (
  //           <Panel
  //             id="settings"
  //             // minSize={16}
  //             // maxSize={16}
  //             order={6}
  //           >
  //             <SettingsView />
  //           </Panel>
  //         )
  //       }
  //     </PanelGroup>
  //   </div>
  // );
};

export default App;

