import CodeEditor from '@uiw/react-textarea-code-editor';

export interface TextareaCodeEditorProps {
  value?: string;
  language?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
  padding?: number;
  style?: React.CSSProperties;
  className?: string;
  dataColorMode?: 'dark' | 'light';
  minHeight?: number;
  theme: 'dark' | 'light';
}

export default function Editor({ value, language, onChange, onKeyDown, disabled, minHeight, style, theme }: TextareaCodeEditorProps) {
  const styles = {
    fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
    margin: 0,
    border: 0,
    paddingLeft: 0,
    paddingRight: 0,
    background: 'none',
    boxSizing: 'inherit' as React.CSSProperties['boxSizing'],
    display: 'inherit',
    fontSize: 'inherit',
    fontStyle: 'inherit',
    fontVariantLigatures: 'inherit',
    fontWeight: 'inherit',
    letterSpacing: 'inherit',
    lineHeight: 'inherit',
    tabSize: 'inherit',
    textIndent: 'inherit',
    textRendering: 'inherit' as React.CSSProperties['textRendering'],
    textTransform: 'inherit' as React.CSSProperties['textTransform'],
    whiteSpace: 'pre-wrap',
    wordBreak: 'keep-all' as React.CSSProperties['wordBreak'],
    overflowWrap: 'break-word' as React.CSSProperties['overflowWrap'],
    outline: 0,
    userSelect: 'text' as React.CSSProperties['userSelect'],
  };
  return (
    <CodeEditor
      disabled={disabled}
      value={value}
      language={language}
      onChange={onChange}
      onKeyDown={onKeyDown}
      padding={0}
      minHeight={minHeight}
      style={{ ...styles, ...style }}
      data-color-mode={theme}
    />
  );
}