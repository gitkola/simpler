import React, { useEffect, useRef, useState } from 'react';
import { ChevronRight } from './Icons';

export interface AccordionTextareaProps {
  title: string;
  content: React.JSX.Element;
  className?: string;
  buttonClassName?: string;
  titleClassName?: string;
  contentClassName?: string;
}

const Accordion = ({ title, content, className, buttonClassName, titleClassName, contentClassName }: AccordionTextareaProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [height, setHeight] = useState('0px');
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? `${contentRef.current.scrollHeight}px` : '0px');
    }
  }, [isOpen]);

  return (
    <div className={`${className}`}>
      {/* <div className={`rounded-sm shadow-md hover:shadow-md ${className}`}> */}
      <button
        className={`flex w-full justify-between items-center hover:shadow-md ${buttonClassName}`}
        // className={`pl-2 pr-1 py-1 flex w-full justify-between items-center rounded-sm border-b border-transparent hover:shadow-md hover:border-b hover:border-opacity-30 hover:border-blue-500 ${buttonClassName}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`font-bold ${titleClassName}`}>{title}</span>
        <ChevronRight size={24} className={`transform transition-transform duration-300 ${isOpen ? '-rotate-90' : 'rotate-90'}`} />
      </button>
      <div
        ref={contentRef}
        style={{ maxHeight: height }}
        className={`overflow-hidden transition-max-height duration-300 ease-in-out ${contentClassName}`}
      // className={`px-0.5 overflow-hidden transition-max-height duration-300 ease-in-out ${contentClassName}`}
      >
        {content}
      </div>
    </div>
  );
};

export default Accordion;
