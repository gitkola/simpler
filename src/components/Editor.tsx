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
}

export default function Editor({ value, language, onChange, onKeyDown, disabled }: TextareaCodeEditorProps) {

  return (
    <CodeEditor
      disabled={disabled}
      value={value}
      language={language}
      onChange={onChange}
      onKeyDown={onKeyDown}
      padding={0}
      style={{
        fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
        margin: 0,
        border: 0,
        padding: 0,
        background: 'none',
        boxSizing: 'inherit',
        display: 'inherit',
        fontSize: 'inherit',
        fontStyle: 'inherit',
        fontVariantLigatures: 'inherit',
        fontWeight: 'inherit',
        letterSpacing: 'inherit',
        lineHeight: 1.7,
        tabSize: 'inherit',
        textIndent: 'inherit',
        textRendering: 'inherit',
        textTransform: 'inherit',
        whiteSpace: 'pre-wrap',
        wordBreak: 'keep-all',
        overflowWrap: 'break-word',
        outline: 0,
        userSelect: 'text',
      }}
      data-color-mode={'light'}
    />
  );
}