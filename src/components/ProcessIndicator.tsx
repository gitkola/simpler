interface LineProgressIndicatorProps {
  color?: string;
  height?: number;
}

const LineProgressIndicator: React.FC<LineProgressIndicatorProps> = ({
  color = '#3b82f6', // Default color (blue-500 in Tailwind)
  height = 4 // Default height in pixels
}) => {
  return (
    <div className="w-[200%] overflow-hidden">
      <div
        className="animate-indeterminate-progress"
        style={{
          height: `${height}px`,
          backgroundColor: color,
        }}
      />
    </div>
  );
};

// You would typically put this in a separate CSS file or use a CSS-in-JS solution
const style = `
@keyframes indeterminate-progress {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-indeterminate-progress {
  width: 50%;
  animation: indeterminate-progress 1.5s infinite cubic-bezier(0.65, 0.815, 0.735, 0.395);
}
`;

const StyleTag = () => <style>{style}</style>;

export default function ProcessIndicator() {
  return (
    <>
      <StyleTag />
      <LineProgressIndicator height={4} />
    </>
  );
}