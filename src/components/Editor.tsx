import CodeEditor from '@uiw/react-textarea-code-editor';
import { useAppSelector } from '../store';

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
  const theme = useAppSelector((state) => state.settings.theme);
  return (
    <CodeEditor
      disabled={disabled}
      value={value}
      language={language}
      onChange={onChange}
      onKeyDown={onKeyDown}
      style={{
        fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
        margin: 0,
        border: 0,
        paddingLeft: 16,
        paddingRight: 16,
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
      data-color-mode={theme as "light" | "dark"}
    />
  );
}