import { CopyBlock } from "react-code-blocks";

interface Props {
    language: string
    value: string
  }

export function CodeCopyBlock({value, language}: Props) {
    const copyBlockProps = {
      text: value,
      language,
      showLineNumbers: false,
      // startingLineNumber: props.startingLineNumber,
      wrapLines: true,
    };

    return (
      <CopyBlock
        {...copyBlockProps}
      />
    );
  }