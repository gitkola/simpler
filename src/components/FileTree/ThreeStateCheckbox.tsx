import React, { useState, useEffect } from 'react';
import { SelectionState } from './fileTreeInterfaces';


// CSS to be included in your styles
const styles = `
.three-state-checkbox {
  width: 16px;
  height: 16px;
  border: 2px solid #333;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.three-state-checkbox:hover {
  background-color: #f0f0f0;
}

.three-state-checkbox.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.checkbox-icon {
  width: 18px;
  height: 18px;
  fill: #333;
}
`;

const StyleTag = () => <style>{styles}</style>;



interface ThreeStateCheckboxProps {
  checked: SelectionState;
  onChange: (newState: SelectionState) => void;
  disabled?: boolean;
}

export const ThreeStateCheckbox: React.FC<ThreeStateCheckboxProps> = ({
  checked,
  onChange,
  disabled = false,
}) => {
  const [internalState, setInternalState] = useState<SelectionState>(checked);

  useEffect(() => {
    setInternalState(checked);
  }, [checked]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (disabled) return;

    const newState =
      internalState === SelectionState.None ? SelectionState.Full :
        internalState === SelectionState.Full ? SelectionState.None :
          SelectionState.Full;

    setInternalState(newState);
    onChange(newState);
  };

  return (
    <div
      className={`three-state-checkbox ${disabled ? 'disabled' : ''}`}
      onClick={handleClick}
      role="checkbox"
      aria-checked={
        internalState === SelectionState.Full ? 'true' :
          internalState === SelectionState.Partial ? 'mixed' :
            'false'
      }
      tabIndex={disabled ? -1 : 0}
      onKeyPress={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          handleClick(e);
          e.preventDefault();
        }
      }}
    >
      <StyleTag />
      {internalState === SelectionState.Full && (
        <svg viewBox="0 0 24 24" className="checkbox-icon">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
        </svg>
      )}
      {internalState === SelectionState.Partial && (
        <svg viewBox="0 0 24 24" className="checkbox-icon">
          <path d="M19 13H5v-2h14v2z" />
        </svg>
      )}
    </div>
  );
};

