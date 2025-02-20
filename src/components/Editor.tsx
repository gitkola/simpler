import CodeEditor from '@uiw/react-textarea-code-editor';
import MonacoEditor from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import { useAppSelector } from '@/store';
import { useCallback } from 'react';

export interface TextareaCodeEditorProps {
  value?: string;
  language?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
  padding?: number;
  style?: React.CSSProperties;
  dataColorMode?: 'dark' | 'light';
  minHeight?: number;
  className?: string;
}

export default function Editor({ value, language, onChange, disabled, className }: TextareaCodeEditorProps) {
  const theme = useAppSelector((state) => state.settings.theme);
  // const styles = {
  //   fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
  //   margin: 0,
  //   border: 0,
  //   paddingLeft: 0,
  //   paddingRight: 0,
  //   backgroundColor: 'transparent',
  //   background: 'transparent',
  //   boxSizing: 'inherit' as React.CSSProperties['boxSizing'],
  //   display: 'inherit',
  //   fontSize: 'inherit',
  //   fontStyle: 'inherit',
  //   fontVariantLigatures: 'inherit',
  //   fontWeight: 'inherit',
  //   letterSpacing: 'inherit',
  //   lineHeight: 'inherit',
  //   tabSize: 'inherit',
  //   textIndent: 'inherit',
  //   textRendering: 'inherit' as React.CSSProperties['textRendering'],
  //   textTransform: 'inherit' as React.CSSProperties['textTransform'],
  //   whiteSpace: 'pre-wrap' as React.CSSProperties['whiteSpace'],
  //   wordBreak: 'keep-all' as React.CSSProperties['wordBreak'],
  //   overflowWrap: 'break-word' as React.CSSProperties['overflowWrap'],
  //   outline: 0,
  //   userSelect: 'text' as React.CSSProperties['userSelect'],
  // };

  const handleChange = useCallback((value: string | undefined, _event: editor.IModelContentChangedEvent) => {
    if (value && onChange)
      onChange({ target: { value: value ? value : '' } } as React.ChangeEvent<HTMLTextAreaElement>);
  }, []);
  return (
    <MonacoEditor
      value={value}
      language={convertFileExtensionToLanguage(language as string)}
      onChange={handleChange}
      height="100%"
      width="100%"
      theme={theme === 'dark' ? 'vs-dark' : 'light'}
      options={{
        readOnly: disabled,
        automaticLayout: true
      }}
      className={`h-full w-full ${className}`}
    />
  );

  // return (
  //   <CodeEditor
  //     disabled={disabled}
  //     value={value}
  //     language={language}
  //     onChange={onChange}
  //     // onKeyDown={onKeyDown}
  //     padding={0}
  //     // minHeight={minHeight}
  //     style={{ ...styles }}
  //     // style={{ ...styles, ...style }}
  //     data-color-mode={theme}
  //   />
  // );
}

const convertFileExtensionToLanguage = (extension: string) => {
  switch (extension) {
    case 'js':
      return 'javascript';
    case 'ts':
      return 'typescript';
    case 'jsx':
      return 'jsx';
    case 'tsx':
      return 'typescript';
    case 'json':
      return 'json';
    case 'html':
      return 'html';
    case 'css':
      return 'css';
    case 'py':
      return 'python';
    case 'java':
      return 'java';
    case 'c':
      return 'c';
    case 'cpp':
      return 'cpp';
    case 'cs':
      return 'csharp';
    case 'rb':
      return 'ruby';
    case 'php':
      return 'php';
    case 'swift':
      return 'swift';
    case 'm':
      return 'objective-c';
    case 'kt':
      return 'kotlin';
    case 'rs':
      return 'rust';
    case 'scala':
      return 'scala';
    case 'md':
      return 'markdown';
    default:
      return extension;
  }
}