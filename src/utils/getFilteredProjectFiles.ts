import { invoke } from "@tauri-apps/api/tauri";
import { ITreeData } from "../store/currentProjectSlice";
import { getFolderNameFromPath } from "./pathUtils";

interface FilterPattern {
  pattern: string;
  exclude: boolean;
}

const initialPatterns: FilterPattern[] = [
  { pattern: "**/node_modules/**", exclude: true },
  { pattern: "**/temp/*", exclude: true },
  { pattern: "**/.git/**", exclude: true },
  { pattern: "**/.simpler/**", exclude: true },
  { pattern: "**/.DS_Store", exclude: true },
  { pattern: "**/package-lock.json", exclude: true },
  { pattern: "**/**.lock", exclude: true },
  { pattern: "**/dist/**", exclude: true },
  { pattern: "**/target/**", exclude: true },
  { pattern: "src-tauri/target/**", exclude: true },
  { pattern: "src-tauri/icons/**", exclude: true },
  { pattern: "**/icons/**", exclude: true },
];

function createAdditionalFilter(patterns: FilterPattern[]) {
  const processedPatterns = patterns.map(({ pattern, exclude }) => ({
    regex: new RegExp(`^${pattern.replace(/\*/g, ".*").replace(/\?/g, ".")}$`),
    exclude,
  }));

  return function filterFiles(filePaths: string[]): string[] {
    return filePaths.filter((filePath) => {
      const normalizedPath = filePath.replace(/\\/g, "/");
      for (const { regex, exclude } of processedPatterns) {
        if (regex.test(normalizedPath)) {
          return !exclude;
        }
      }
      return true;
    });
  };
}

export async function getFilteredProjectFiles(
  projectPath: string,
  useAdditionalFilter: boolean = true
): Promise<string[]> {
  try {
    // TODO: work under optimisation.
    const start = Date.now();
    console.log("Scanning directory:", projectPath);
    const files = await invoke<string[]>("scan_directory_with_gitignore", {
      root: projectPath,
    });
    console.log("Scanning directory took:", Date.now() - start, "ms", files);
    if (!useAdditionalFilter) return files.sort((a, b) => a.localeCompare(b));
    const additionalFilter = createAdditionalFilter(initialPatterns);
    return additionalFilter(files).sort((a, b) => a.localeCompare(b));
  } catch (error) {
    console.error("Error scanning directory:", error);
    throw error;
  }
}

export function getTreeData(
  absoluteFilePaths: string[],
  projectPath: string
): ITreeData {
  const root: ITreeData = {
    name: getFolderNameFromPath(projectPath),
    path: "/",
    checked: 0,
    children: [],
    isOpen: true,
    selected: false,
  };

  absoluteFilePaths.forEach((filePath) => {
    if (filePath.includes(".DS_Store")) return;
    const parts = filePath
      .replace(`${projectPath}/`, "")
      .split("/")
      .filter(Boolean);
    let currentNode = root;

    parts.forEach((part, index) => {
      const isLastPart = index === parts.length - 1;
      const path = "/" + parts.slice(0, index + 1).join("/");
      let node = currentNode.children?.find((child) => child.name === part);

      if (!node) {
        node = {
          name: part,
          path: path,
          checked: 0,
          isOpen: isLastPart ? undefined : false,
          children: isLastPart ? undefined : [],
          selected: isLastPart ? false : undefined,
        };
        currentNode.children = currentNode.children || [];
        currentNode.children.push(node);
      } else if (isLastPart) {
        node.checked = 0;
        node.selected = false;
      }

      currentNode = node;
    });
  });

  return root;
}
