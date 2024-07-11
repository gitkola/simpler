export interface ProjectSettings {
  service: "openai" | "anthropic";
  model: string;
  temperature: number;
  max_tokens: number;
  // Add other model-specific settings as needed
}

export interface Project {
  id: number;
  name: string;
  path: string;
  messages: Message[];
  settings: ProjectSettings;
  createdAt: number;
  updatedAt: number;
}

export interface ProjectListItem {
  id: number;
  path: string;
  name: string;
}

export interface Message {
  id: number;
  content: string;
  sender: "user" | "ai";
  createdAt: number;
  updatedAt: number;
  edited?: boolean;
}

export type Entity = Project | Message;

export const createTimestamps = () => {
  const now = Date.now();
  return { createdAt: now, updatedAt: now };
};

export const updateTimestamp = (entity: Entity) => {
  return { ...entity, updatedAt: Date.now() };
};

export type ModelResponse = ContentItem[];

export type ContentItem =
  | { title: string }
  | { text: string }
  | { code: CodeTuple }
  | { link: LinkTuple };

export type CodeTuple = [
  string, // code content (required)
  string | null, // file extension (optional)
  string | null, // file path (optional)
  string | null // description (optional)
];

export type LinkTuple = [
  string, // URL (required)
  string | null // description (optional)
];

// Type guard functions
export const isTitle = (item: ContentItem): item is { title: string } =>
  "title" in item;
export const isText = (item: ContentItem): item is { text: string } =>
  "text" in item;
export const isCode = (item: ContentItem): item is { code: CodeTuple } =>
  "code" in item;
export const isLink = (item: ContentItem): item is { link: LinkTuple } =>
  "link" in item;

// Get type function
export const getType = (
  item: ContentItem
): "title" | "text" | "code" | "link" => {
  if (isTitle(item)) return "title";
  if (isText(item)) return "text";
  if (isCode(item)) return "code";
  if (isLink(item)) return "link";
  throw new Error("Unknown content type");
};

// Helper function to create a code item
export const createCodeItem = (
  code: string,
  fileExtension: string | null = null,
  path: string | null = null,
  description: string | null = null
): { code: CodeTuple } => ({
  code: [code, fileExtension, path, description],
});

// Helper function to create a link item
export const createLinkItem = (
  url: string,
  description: string | null = null
): { link: LinkTuple } => ({
  link: [url, description],
});
