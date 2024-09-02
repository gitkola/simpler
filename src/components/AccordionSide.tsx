import React, { useEffect, useRef, useState } from 'react';
import { ChevronRight } from './Icons';

export interface AccordionTextareaProps {
  content?: React.JSX.Element;
  className?: string;
  buttonClassName?: string;
  contentClassName?: string;
}

const AccordionSide = ({ content, className, buttonClassName, contentClassName }: AccordionTextareaProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [height, setHeight] = useState('12em');
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? `${contentRef.current.scrollHeight}px` : '12em');
    }
  }, [isOpen]);

  return (
    <div className={`flex rounded bg-gray-500 bg-opacity-30 h-full ${className}`}>
      <div
        ref={contentRef}
        style={{ maxHeight: height }}
        className={`overflow-hidden transition-max-height duration-300 ease-in-out ${contentClassName}`}
      >
        {content}
      </div>
      <div className="relative top-0 left-0 right-0 z-10 h-0 w-0">
        <button
          className={`w-6 z-10 absolute top-0 left-8 rounded bg-blue-500 bg-opacity-40 hover:bg-opacity-10  justify-between items-center focus:outline-none ${buttonClassName}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <ChevronRight size={24} className={`transform transition-transform duration-300 ${isOpen ? '-rotate-90' : 'rotate-90'}`} />
        </button>
      </div>
    </div>
  );
};

export default AccordionSide;
