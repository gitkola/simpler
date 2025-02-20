import { useRef, useEffect } from "react";

const RenderCounter = ({ name = "Render count" }) => {
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
  });
  console.log({ name, count: renderCount.current });
  return (
    <div className="relative flex text-red-600 justify-center">
      <div className="absolute top-0 text-red-600">
        <span className="font-semibold">{name} renders: </span>
        <span className="font-semibold">{renderCount.current}</span>
      </div>
    </div>
  );
};

export default RenderCounter;
