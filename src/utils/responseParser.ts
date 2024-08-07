import { ModelResponse, ContentItem } from "../types";

export function parseAIResponse(response: string): ModelResponse {
  try {
    // First, try to parse as JSON
    const parsedResponse = JSON.parse(response);
    if (Array.isArray(parsedResponse)) {
      return parsedResponse as ModelResponse;
    }
    throw new Error("Response is not an array");
  } catch (error) {
    // If JSON parsing fails, fall back to string parsing
    return parseStringResponse(response);
  }
}

function parseStringResponse(response: string): ModelResponse {
  const lines = response.split("\n");
  const result: ContentItem[] = [];
  let currentContent: string[] = [];
  let isInCodeBlock = false;
  let codeLanguage = "";

  function addTextContent() {
    if (currentContent.length > 0) {
      result.push({ text: currentContent.join("\n") });
      currentContent = [];
    }
  }

  for (const line of lines) {
    if (line.startsWith("```")) {
      if (isInCodeBlock) {
        // End of code block
        result.push({
          code: [currentContent.join("\n"), codeLanguage || "0", "0", "0"],
        });
        currentContent = [];
        codeLanguage = "";
      } else {
        // Start of code block
        addTextContent();
        codeLanguage = line.slice(3).trim(); // Get language if specified
      }
      isInCodeBlock = !isInCodeBlock;
    } else if (isInCodeBlock) {
      currentContent.push(line);
    } else if (line.startsWith("# ")) {
      addTextContent();
      result.push({ title: line.slice(2).trim() });
    } else if (line.startsWith("http://") || line.startsWith("https://")) {
      addTextContent();
      result.push({ link: [line.trim(), "0"] });
    } else {
      currentContent.push(line);
    }
  }

  // Add any remaining content
  if (isInCodeBlock) {
    result.push({
      code: [currentContent.join("\n"), codeLanguage || "0", "0", "0"],
    });
  } else {
    addTextContent();
  }

  return result;
}
