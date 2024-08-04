import React, { useEffect } from "react";
// import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import SidePanel from "./components/SidePanel";
import EditorView from "./components/EditorView";
import ProjectStateView from "./components/ProjectStateView";
import { ChatView } from "./components/ChatView";
import { RootState, useAppDispatch, useAppSelector } from "./store";
import { loadProject } from "./store/currentProjectSlice";
import ProjectList from "./components/ProjectList";
import FileTreeView from "./components/FileTreeView";
import Settings from "./components/Settings";
import { StyleTag } from "./styles/styles";
// import FilesCompareView from "./components/FilesCompareView";
// import FileTreeView2 from "./components/FileTreeView2";
// import FileTreeView3 from "./components/FileTreeView3";
// import { resizeHandle } from "./styles/styles";



const App: React.FC = () => {
  const activeProjectPath = useAppSelector((state: RootState) => state.projects.activeProjectPath);
  const dispatch = useAppDispatch();

  const loadProjectData = async () => {
    await dispatch(loadProject());
  };

  useEffect(() => {
    if (!activeProjectPath) return;
    loadProjectData();
  }, [activeProjectPath]);
  const { showProjects, showFileTree, showSettings, showCodeEditor, showChat, showProjectState } = useAppSelector((state) => state.layout);
  // const fileTree = useAppSelector((state) => state.fileTree);
  // const flatFileTree = useAppSelector((state) => state.flatFileTree);
  // console.log({ fileTree, flatFileTree });


  return (
    <div className="flex">
      <StyleTag />
      <SidePanel />
      <div className="overflow-x-scroll">
        <div className="flex">
          {showProjects && <ProjectList />}
          {showProjectState && <ProjectStateView />}
          {showFileTree && <FileTreeView />}
          {/* {showFileTree && <FileTreeView2 />}
          {showFileTree && <FileTreeView3 />} */}
          {showCodeEditor && <EditorView />}
          {/* {showCodeEditor && <FilesCompareView />} */}
          {showChat && <ChatView />}
          {showSettings && <Settings />}
        </div>
      </div>
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
  //               <ProjectList />
  //             </Panel>
  //             <PanelResizeHandle className={`${resizeHandle}`} />
  //           </>
  //         )
  //       }
  //       {
  //         showProjectState && (
  //           <>
  //             <Panel
  //               id="project-state"
  //               // minSize={16}
  //               // maxSize={24}
  //               order={2}
  //             >
  //               <ProjectStateView />
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
  //               id="chat"
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
  //             <Settings />
  //           </Panel>
  //         )
  //       }
  //     </PanelGroup>
  //   </div>
  // );
};

export default App;

