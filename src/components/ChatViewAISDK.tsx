import React from "react";
import { Messages, ThreeDotsIcon } from "./Icons";
// import MessagesThread from "./Messages/MessagesThread";
import InputSection from "./InputSection";
import RenderCounter from "./RenderCounter";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import {
  loadCurrentProjectConversation,
  saveCurrentProjectConversation,
} from "@/store/currentProjectSlice";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import SquareButton from "./SquareButton";
import { setShowThread } from "@/store/layoutSlice";
import { Thread } from "./ChatUI/Thread";

export const ChatViewAISDK: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const conversationsNames = useSelector(
    (state: RootState) => state.currentProject.currentProjectConversationsNames
  );
  const conversationsName = useSelector(
    (state: RootState) => state.currentProject.currentProjectConversationName
  );

  const handleNewConversation = () => {
    dispatch(saveCurrentProjectConversation([]));
  };

  const handleSelectConversation = (fileName: string) => {
    dispatch(loadCurrentProjectConversation(fileName));
  };

  return (
    <div className="flex flex-col border-r border-0.5 min-w-[900px] max-w-[1200px]">
      <StyleTag />
      <RenderCounter name="ChatViewAISDK" />
      <div className="flex pl-2 space-x-2 items-center justify-between border-b border-0.5">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Messages className="w-8 h-8" />
            <h2 className="text-lg font-semibold">AI Chat Vercel SDK</h2>
          </div>
          <div className="flex items-center space-x-2">{conversationsName}</div>
          <div>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="IconButton" aria-label="Conversations">
                  <ThreeDotsIcon className="w-6 h-6" />
                </button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="DropdownMenuContent"
                  sideOffset={5}
                >
                  <DropdownMenu.Item
                    className="DropdownMenuItem  bg-slate-300 p-2 rounded"
                    onSelect={handleNewConversation}
                  >
                    New Conversation
                  </DropdownMenu.Item>

                  <DropdownMenu.Separator className="DropdownMenuSeparator" />

                  <div className="ScrollableArea">
                    {conversationsNames.map((fileName) => (
                      <DropdownMenu.Item
                        key={fileName}
                        className="DropdownMenuItem"
                        onSelect={() => handleSelectConversation(fileName)}
                      >
                        {fileName}
                      </DropdownMenu.Item>
                    ))}
                  </div>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        </div>
        <SquareButton
          icon="close"
          className=""
          onClick={() => {
            dispatch(setShowThread(false));
          }}
        />
      </div>
      <div className="flex flex-1 h-full w-full flex-col justify-between overflow-hidden">
        {/* <MessagesThread /> */}
        <Thread />
        <InputSection />
      </div>
    </div>
  );
};

// Add these styles to your CSS file or styled-components
const styles = `
.DropdownMenuContent {
  min-width: 220px;
  background-color: white;
  border-radius: 6px;
  padding: 5px;
  box-shadow: 0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2);
}

.DropdownMenuItem {
  font-size: 13px;
  line-height: 1;
  color: #11181C;
  border-radius: 3px;
  display: flex;
  align-items: center;
  height: 25px;
  padding: 0 5px;
  position: relative;
  padding-left: 25px;
  user-select: none;
  outline: none;
}

.DropdownMenuItem:focus {
  background-color: #F6F8FA;
}

.DropdownMenuSeparator {
  height: 1px;
  background-color: #E5E7EB;
  margin: 5px;
}

.ScrollableArea {
  min-height: 200px;
  max-height: 300px;
  overflow-y: auto;
}
`;

const StyleTag = () => <style>{styles}</style>;
