import { useRef, useEffect } from 'react';

const RenderCounter = ({ name = 'Render count' }) => {
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
  });

  return (
    <div className="text-red-600">
      <span className="font-semibold">{name} renders: </span>
      <span className="font-semibold">{renderCount.current}</span>
    </div>
  );
};

export default RenderCounter;