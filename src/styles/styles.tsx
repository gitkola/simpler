import { RootState, useAppSelector } from "../store";
export const textInput = `flex p-2 h-fit w-full rounded-sm ring-1 ring-gray-300 overflow-auto resize-none hover:ring-1 hover:ring-gray-300 hover:shadow-inner hover:shadow-gray-300 focus:outline-none focus:ring-blue-300 focus:shadow-blue-300 focus:shadow-inner focus:ring-1`;
export const outlineButton = `flex min-w-fit max-h-8 bg-transparent border-blue-500 border text-blue-600 rounded-full hover:bg-blue-50 hover:bottom-0.5 hover:relative hover:shadow-md focus:outline-none px-2 items-center justify-center disabled:opacity-50 space-x-2`;
export const resizeHandle = `border hover:border-blue-500 active:border-blue-500`;

export const cPrimary = (
  isActive?: boolean,
  color: string = "blue",
) => {
  const always = `transition-all duration-100 bg-${color}-500 bg-opacity-0`;
  const inactive = !isActive ? ` ` : "";
  const active = isActive ? ` bg-opacity-40` : "";
  const hover = ` hover:bg-opacity-20`;
  return always + inactive + active + hover;
};

export const StyleTag = () => {
  const { styles, theme } = useAppSelector(
    (state: RootState) => state.settings
  );
  let themeStyle;
  if (theme === "light") {
    themeStyle = `
        body {
          background-color: rgb(253 247 227);
          color: rgb(27 37 57);
        }
      `;
  } else if (theme === "dark") {
    themeStyle = `
        body {
          background-color: rgba(0, 0, 0, 0.88);
          color: rgba(255, 255, 255, 0.85);
        }
      `;
  }
  return (
    <style>
      {styles} {themeStyle}
    </style>
  );
};
