import React from "react";

const STROKE_WIDTH = 1;

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
  strokeWidth?: number;
}

interface SVGWrapperProps extends IconProps {
  children: React.ReactNode;
}

export const SVGWrapper: React.FC<SVGWrapperProps> = ({
  size = 24,
  color = "currentColor",
  className = "",
  strokeWidth = STROKE_WIDTH,
  children,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {children}
  </svg>
);

export const ChevronDown: React.FC<IconProps> = (props) => (
  <SVGWrapper {...props}>
    <polyline points="6 9 12 15 18 9"></polyline>
  </SVGWrapper>
);

export const ChevronRight: React.FC<IconProps> = (props) => (
  <SVGWrapper {...props}>
    <polyline points="9 18 15 12 9 6"></polyline>
  </SVGWrapper>
);

export const ChevronLeft: React.FC<IconProps> = (props) => (
  <SVGWrapper {...props}>
    <polyline points="15 18 9 12 15 6"></polyline>
  </SVGWrapper>
);

export const ChevronDoubleRight: React.FC<IconProps> = (props) => (
  <SVGWrapper {...props}>
    <polyline points="13 17 18 12 13 7"></polyline>
    <polyline points="6 17 11 12 6 7"></polyline>
  </SVGWrapper>
);

export const ChevronDoubleLeft: React.FC<IconProps> = (props) => (
  <SVGWrapper {...props}>
    <polyline points="11 17 6 12 11 7"></polyline>
    <polyline points="18 17 13 12 18 7"></polyline>
  </SVGWrapper>
);

export const Plus: React.FC<IconProps> = (props) => (
  <SVGWrapper {...props}>
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </SVGWrapper>
);

export const Dashboard: React.FC<IconProps> = (props) => (
  <SVGWrapper {...props}>
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </SVGWrapper>
);

export const CodeEditor: React.FC<IconProps> = (props) => (
  <SVGWrapper {...props}>
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </SVGWrapper>
);

export const FileExplorer: React.FC<IconProps> = (props) => (
  <SVGWrapper {...props}>
    <path d="M3 3h18v18H3zM3 9h18M9 21V9"></path>
  </SVGWrapper>
);

export const Settings: React.FC<IconProps> = (props) => (
  <SVGWrapper {...props}>
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </SVGWrapper>
);

export const ArrowUp: React.FC<IconProps> = (props) => (
  <SVGWrapper {...props}>
    <line x1="12" y1="19" x2="12" y2="5"></line>
    <polyline points="5 12 12 5 19 12"></polyline>
  </SVGWrapper>
);

export const ThreeDotsIcon: React.FC<IconProps> = (props) => (
  <SVGWrapper {...props}>
    <circle cx="5" cy="12" r="2" fill="currentColor" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
    <circle cx="19" cy="12" r="2" fill="currentColor" />
  </SVGWrapper>
);

export const Edit: React.FC<IconProps> = (props) => (
  <SVGWrapper {...props}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </SVGWrapper>
);

export const Trash: React.FC<IconProps> = (props) => (
  <SVGWrapper {...props}>
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </SVGWrapper>
);

export const Close: React.FC<IconProps> = (props) => (
  <SVGWrapper {...props}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </SVGWrapper>
);

export const Folder: React.FC<IconProps> = (props) => (
  <SVGWrapper {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
    />
  </SVGWrapper>
);

export const File: React.FC<IconProps> = (props) => (
  <SVGWrapper {...props}>
    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
    <polyline points="13 2 13 9 20 9"></polyline>
  </SVGWrapper>
);

export const Projects: React.FC<IconProps> = (props) => (
  <SVGWrapper {...props}>
    {/* <rect x="2" y="2" width="8" height="8" rx="2" ry="2"></rect>
    <rect x="14" y="2" width="8" height="8" rx="2" ry="2"></rect>
    <rect x="2" y="14" width="8" height="8" rx="2" ry="2"></rect>
    <rect x="14" y="14" width="8" height="8" rx="2" ry="2"></rect> */}
    <path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z" />
    <path d="m7 16.5-4.74-2.85" />
    <path d="m7 16.5 5-3" />
    <path d="M7 16.5v5.17" />
    <path d="M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z" />
    <path d="m17 16.5-5-3" />
    <path d="m17 16.5 4.74-2.85" />
    <path d="M17 16.5v5.17" />
    <path d="M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z" />
    <path d="M12 8 7.26 5.15" />
    <path d="m12 8 4.74-2.85" />
    <path d="M12 13.5V8" />
  </SVGWrapper>
);

export const SidebarIcon: React.FC<IconProps> = (props) => (
  <SVGWrapper {...props}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="9" y1="3" x2="9" y2="21"></line>
  </SVGWrapper>
);

export const OpenProject: React.FC<IconProps> = (props) => (
  <SVGWrapper {...props}>
    <path d="M3 3h6v6H3z"></path>
    <path d="M14 3h7v7h-7z"></path>
    <path d="M14 14h7v7h-7z"></path>
    <path d="M3 14h6v6H3z"></path>
    <path d="M10 10l4 4"></path>
  </SVGWrapper>
);

export const Open: React.FC<IconProps> = (props) => (
  <SVGWrapper {...props}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
    <polyline points="15 3 21 3 21 9"></polyline>
    <line x1="10" y1="14" x2="21" y2="3"></line>
  </SVGWrapper>
);

export const OpenFolder: React.FC<IconProps> = (props) => (
  <SVGWrapper {...props}>
    <path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2" />
  </SVGWrapper>
);

export const FolderTree: React.FC<IconProps> = (props) => (
  <SVGWrapper {...props}>
    <path d="M20 10a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2.5a1 1 0 0 1-.8-.4l-.9-1.2A1 1 0 0 0 15 3h-2a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1Z" />
    <path d="M20 21a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-2.9a1 1 0 0 1-.88-.55l-.42-.85a1 1 0 0 0-.92-.6H13a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1Z" />
    <path d="M3 5a2 2 0 0 0 2 2h3" />
    <path d="M3 3v13a2 2 0 0 0 2 2h3" />
  </SVGWrapper>
);
export const Chat: React.FC<IconProps> = (props) => (
  <SVGWrapper {...props}>
    <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2z" />
    <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
  </SVGWrapper>
);

export const ProjectState: React.FC<IconProps> = (props) => (
  <SVGWrapper {...props}>
    <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
    <path d="M8 10v4" />
    <path d="M12 10v2" />
    <path d="M16 10v6" />
  </SVGWrapper>
);

export const QuestionMark: React.FC<IconProps> = (props) => (
  <SVGWrapper {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <path d="M12 17h.01" />
  </SVGWrapper>
);

export type AppIcons =
  | "chevron-down"
  | "chevron-right"
  | "chevron-left"
  | "chevron-double-right"
  | "chevron-double-left"
  | "plus"
  | "dashboard"
  | "code-editor"
  | "file-explorer"
  | "settings"
  | "arrow-up"
  | "three-dots"
  | "edit"
  | "trash"
  | "folder"
  | "file"
  | "projects"
  | "sidebar"
  | "open-project"
  | "open"
  | "open-folder"
  | "folder-tree"
  | "chat"
  | "project-state"
  | "question-mark";

interface IAppIconProps extends IconProps {
  icon: AppIcons;
}

export default function AppIcon({
  icon,
  size,
  color,
  className,
}: IAppIconProps) {
  switch (icon) {
    case "chevron-down":
      return <ChevronDown size={size} color={color} className={className} />;
    case "chevron-right":
      return <ChevronRight size={size} color={color} className={className} />;
    case "chevron-left":
      return <ChevronLeft size={size} color={color} className={className} />;
    case "chevron-double-right":
      return (
        <ChevronDoubleRight size={size} color={color} className={className} />
      );
    case "chevron-double-left":
      return (
        <ChevronDoubleLeft size={size} color={color} className={className} />
      );
    case "plus":
      return <Plus size={size} color={color} className={className} />;
    case "dashboard":
      return <Dashboard size={size} color={color} className={className} />;
    case "code-editor":
      return <CodeEditor size={size} color={color} className={className} />;
    case "file-explorer":
      return <FileExplorer size={size} color={color} className={className} />;
    case "settings":
      return <Settings size={size} color={color} className={className} />;
    case "arrow-up":
      return <ArrowUp size={size} color={color} className={className} />;
    case "three-dots":
      return <ThreeDotsIcon size={size} color={color} className={className} />;
    case "edit":
      return <Edit size={size} color={color} className={className} />;
    case "trash":
      return <Trash size={size} color={color} className={className} />;
    case "folder":
      return <Folder size={size} color={color} className={className} />;
    case "file":
      return <File size={size} color={color} className={className} />;
    case "projects":
      return <Projects size={size} color={color} className={className} />;
    case "sidebar":
      return <SidebarIcon size={size} color={color} className={className} />;
    case "open-project":
      return <OpenProject size={size} color={color} className={className} />;
    case "open":
      return <Open size={size} color={color} className={className} />;
    case "open-folder":
      return <OpenFolder size={size} color={color} className={className} />;
    case "folder-tree":
      return <FolderTree size={size} color={color} className={className} />;
    case "chat":
      return <Chat size={size} color={color} className={className} />;
    case "project-state":
      return <ProjectState size={size} color={color} className={className} />;
    case "question-mark":
      return <QuestionMark size={size} color={color} className={className} />;
    default:
      return <QuestionMark size={size} color={color} className={className} />;
  }
}
