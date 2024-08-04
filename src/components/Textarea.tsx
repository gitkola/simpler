import { useEffect, useRef, useState } from 'react';
import { textInput } from '../styles/styles';

export interface AccordionTextareaProps {
  initialValue: string;
  onSave?: (data: string) => void;
  onDelete?: () => void;
  onAdd?: (data: string) => void;
  placeholder?: string;
  rows?: number;
  editing?: boolean;
  className?: string;
}

const Textarea = ({ initialValue, onSave, onDelete, onAdd, placeholder, rows, editing, className }: AccordionTextareaProps) => {
  const [text, setText] = useState(initialValue);
  const [isEditMode, setIsEditMode] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    adjustTextareaHeight();
  }, [text, isEditMode]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const isEdited = initialValue !== text;

  const onCancel = () => {
    setText(initialValue);
    setIsEditMode(false);
  };

  const handleSave = () => {
    onSave && onSave(text);
    setIsEditMode(false);
  };

  const handleAdd = () => {
    onAdd && onAdd(text);
    onCancel();
  };

  if (editing) {
    return (
      <div className={`${className}`}>
        <textarea
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          autoSave="off"
          spellCheck={false}
          ref={textareaRef}
          className={`${textInput} py-1`}
          value={text}
          onChange={e => setText(e.target.value)}
          rows={rows}
          placeholder={placeholder}
        />
        <div className="mt-1 flex justify-end space-x-1">
          <button
            className="px-2 py-1 border border-gray-300 bg-white bg-opacity-20 rounded-md hover:shadow-md hover:bg-opacity-40 transition-colors"
            onClick={onCancel}
          >
            Cancel
          </button>
          {
            onSave && (
              <button
                className="px-2 py-1 bg-blue-500 text-white rounded-md hover:shadow-md hover:bg-blue-600 transition-colors"
                onClick={handleSave}
              >
                Save
              </button>
            )
          }
          {
            onAdd && (
              <button
                className="px-2 py-1 bg-green-500 text-white rounded-md hover:shadow-md hover:bg-green-600 transition-colors"
                onClick={handleAdd}
              >
                Add
              </button>
            )
          }
          {
            onDelete && (
              <button
                className="px-2 py-1 bg-red-500 text-white rounded-md hover:shadow-md hover:bg-red-600 transition-colors"
                onClick={onDelete}
              >
                Delete
              </button>
            )
          }
        </div>
      </div>
    )
  }

  return (
    <div className={`${className}`}>
      {
        (editing || isEditMode) ? (
          <textarea
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
            autoSave="off"
            spellCheck={false}
            ref={textareaRef}
            className={`${textInput} py-1`}
            value={text}
            onChange={e => setText(e.target.value)}
            rows={rows}
            placeholder={placeholder}
          />
        ) : (
          <div
            className={`${textInput} py-1`}
            onDoubleClick={() => setIsEditMode(true)}
          >
            {text || placeholder}
          </div>
        )
      }

      {(isEditMode || isEdited) && (
        <div className="mt-1 flex justify-end space-x-1">
          <button
            className="px-2 py-1 border border-gray-300 bg-white bg-opacity-20 rounded-md hover:shadow-md hover:bg-opacity-40 transition-colors"
            onClick={onCancel}
          >
            Cancel
          </button>
          {
            onSave && (
              <button
                className="px-2 py-1 bg-blue-500 text-white rounded-md hover:shadow-md hover:bg-blue-600 transition-colors"
                onClick={handleSave}
              >
                Save
              </button>
            )
          }
          {
            onAdd && (
              <button
                className="px-2 py-1 bg-green-500 text-white rounded-md hover:shadow-md hover:bg-green-600 transition-colors"
                onClick={handleAdd}
              >
                Add
              </button>
            )
          }
          {
            onDelete && (
              <button
                className="px-2 py-1 bg-red-500 text-white rounded-md hover:shadow-md hover:bg-red-600 transition-colors"
                onClick={onDelete}
              >
                Delete
              </button>
            )
          }
        </div>
      )}
    </div>
  );
};

export default Textarea;