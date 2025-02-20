import React from "react";
import { Button } from "@radix-ui/themes";
import { CopyIcon, SaveIcon } from "lucide-react";
import { getFullFilePath, writeFile } from "@/services/fsService";

export const usePessed = (onPress = Promise.resolve, initialState = false) => {
  const [pressed, setPressed] = React.useState(initialState);
  const handlePress = async () => {
    await onPress();
    setPressed(true);
    setTimeout(() => setPressed(false), 2000);
  };
  return [pressed, handlePress] as const;
}

const className = 'flex flex-row gap-1 items-center justify-center border px-2 py-1 rounded-md border-green-500 bg-green-500 bg-opacity-30 hover:bg-green-500 hover:bg-opacity-50 active:bg-green-700 active:bg-opacity-30 font-mono text-xs';

export const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = React.useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <Button
      className={className}
      onClick={handleCopy}>
      {copied ? "Copied!" : (<><CopyIcon className="h-4 w-4" /> Copy</>)}
    </Button>
  );
};

export const SaveButton = ({ content, path }: { content: string, path: string }) => {
  const [fullFilePath, setFullFilePath] = React.useState("");
  React.useEffect(() => {
    (async () => {
      const fullPath = await getFullFilePath(path);
      setFullFilePath(fullPath);
    })();
  }, [path]);
  const handleSave = async () => {
    await writeFile(content, path);
  };
  const [pressed, handlePress] = usePessed(handleSave);
  return (
    <Button
      disabled={pressed}
      className={className}
      onClick={handlePress}>
      {pressed ? "Saved!" : (<><SaveIcon className="h-4 w-4" /> Save to {fullFilePath}</>)}
    </Button>
  );
};