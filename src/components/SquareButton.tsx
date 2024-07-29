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

export default function SquareButton({
  onClick,
  icon,
  className,
  disabled,
  isActive,
  iconSize = 32,
  iconColor,
  iconClassName,
}: ISquareButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-12 h-12 flex items-center justify-center hover:text-gray-600 hover:bg-blue-400 select-none ${className} ${isActive && "bg-blue-600"}`}
      disabled={disabled}
    >
      <AppIcon
        icon={icon}
        size={iconSize}
        color={iconColor}
        className={iconClassName}
      />
    </button>
  );
}