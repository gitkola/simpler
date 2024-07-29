import AppIcon, { AppIcons } from "./Icons";

interface ISquareButtonProps {
  onClick: (data: any) => void;
  icon: AppIcons;
  className?: string;
  disabled?: boolean;
  isActive?: boolean;
  iconSize?: number;
  iconColor?: string;
  iconClassName?: string;
}

export default function SquareButton({ onClick, icon, className, disabled, isActive, iconSize, iconColor, iconClassName }: ISquareButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-10 h-10 flex items-center justify-center bg-gray-800 text-gray-300 hover:bg-gray-400 hover:text-white select-none ${className} ${isActive && 'bg-gray-700'}`}
      disabled={disabled}
    >
      <AppIcon icon={icon} size={iconSize} color={iconColor} className={iconClassName} />
    </button>
  );
}