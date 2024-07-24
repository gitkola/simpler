interface FilterPattern {
  pattern: string;
  exclude: boolean;
}

function createGitignoreStyleFilter(patterns: FilterPattern[]) {
  return function filterFiles(filePaths: string[]): string[] {
    const processedPatterns = patterns.map(({ pattern, exclude }) => ({
      regex: new RegExp(
        `^${pattern.replace(/\*/g, ".*").replace(/\?/g, ".")}$`
      ),
      exclude,
    }));

    return filePaths.filter((filePath) => {
      // Normalize path separators
      const normalizedPath = filePath.replace(/\\/g, "/");

      // Check against each pattern
      for (const { regex, exclude } of processedPatterns) {
        if (regex.test(normalizedPath)) {
          return !exclude; // If it matches an exclude pattern, filter it out
        }
      }

      return true; // Include by default if no patterns match
    });
  };
}

const filterFiles = createGitignoreStyleFilter([
  // { pattern: '*.ts', exclude: false },     // Include all TypeScript files
  // { pattern: '*.js', exclude: false },     // Include all JavaScript files
  // { pattern: "*.txt", exclude: false }, // Include all .txt files
  // { pattern: '**/*.test.ts', exclude: true } // Exclude test files
  { pattern: "**/node_modules/**", exclude: true }, // Exclude node_modules directory
  { pattern: "**/temp/*", exclude: true }, // Exclude everything in the temp directory
  { pattern: "**/.git/**", exclude: true }, // Exclude .git directories and their contents
  { pattern: "**/.simpler/**", exclude: true }, // Exclude .simpler directories and their contents
  { pattern: "**/.DS_Store", exclude: true }, // Exclude .simpler directories and their contents
]);

export function applyFileFilter(filePaths: string[]): string[] {
  return filterFiles(filePaths);
}
