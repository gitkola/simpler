import { invoke } from "@tauri-apps/api/tauri";

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
  projectPath: string
): Promise<string[]> {
  try {
    // TODO: work under optimisation.
    // const start = Date.now();
    // console.log("Scanning directory:", projectPath);
    const files = await invoke<string[]>("scan_directory_with_gitignore", {
      root: projectPath,
    });
    // console.log("Scanning directory took:", Date.now() - start, "ms", files);
    // TODO: Additional filter needed for Project State
    // const additionalFilter = createAdditionalFilter(initialPatterns);
    // return additionalFilter(files).sort((a, b) => {
    //   return a.localeCompare(b);
    // });
    return files.sort((a, b) => {
      return a.localeCompare(b);
    });
  } catch (error) {
    console.error("Error scanning directory:", error);
    throw error;
  }
}
