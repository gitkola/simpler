import React from "react";
import ReactJson, { ThemeKeys } from "react-json-view";
import { Button } from "./ui/button";
import { WrapText } from "lucide-react";

export interface JsonViewProps {
  src: object;
  name: string | null;
  collapsed?: boolean;
  styles?: object;
}

const themes: ThemeKeys[] = [
  "apathy",
  "apathy:inverted",
  "ashes",
  "bespin",
  "brewer",
  "bright:inverted",
  "bright",
  "chalk",
  "codeschool",
  "colors",
  "eighties",
  "embers",
  "flat",
  "google",
  "grayscale",
  "grayscale:inverted",
  "greenscreen",
  "harmonic",
  "hopscotch",
  "isotope",
  "marrakesh",
  "mocha",
  "monokai",
  "ocean",
  "paraiso",
  "pop",
  "railscasts",
  "rjv-default",
  "shapeshifter",
  "shapeshifter:inverted",
  "solarized",
  "summerfruit",
  "summerfruit:inverted",
  "threezerotwofour",
  "tomorrow",
  "tube",
  "twilight",
];

export const JsonView: React.FC<JsonViewProps> = ({
  src,
  name,
  styles,
  collapsed = false,
}) => {
  const [whiteSpace, setWhiteSpace] = React.useState<"pre-wrap" | "none">(
    "none"
  );
  return (
    <div style={{ position: "relative" }}>
      <ReactJson
        src={src}
        // theme={themes[34]}
        theme={{
          base00: "#88888800",
          base01: "#888888",
          base02: "#88888844",
          base03: "#888888",
          base04: "#888888",
          base05: "#888888",
          base06: "#888888",
          base07: "#888888",
          base08: "#888888",
          base09: "#888888",
          base0A: "#888888",
          base0B: "#888888",
          base0C: "#888888",
          base0D: "#888888",
          base0E: "#888888",
          base0F: "#888888",
        }}
        style={{
          // backgroundColor: "transparent",
          // padding: "1rem",
          display: "flex",
          overflow: "auto",
          whiteSpace: whiteSpace,
          ...styles,
        }}
        name={name}
        iconStyle={"triangle"}
        collapsed={collapsed}
        collapseStringsAfterLength={100}
        displayObjectSize={false}
        displayDataTypes={false}
        // displayArrayKey={false}
        // enableClipboard={(copy) => {
        //   console.log("you copied to clipboard!", copy);
        //   navigator.clipboard.writeText(JSON.stringify(copy.src, null, 2));
        // }}
        enableClipboard={false}
        quotesOnKeys={false}
      />
      <Button
        className={`absolute top-4 right-0 w-6 h-6 p-0.5 ${
          whiteSpace === "pre-wrap" ? "opacity-100" : "opacity-20"
        }`}
        size="icon"
        variant={"ghost"}
        onClick={() => {
          setWhiteSpace((prev) => (prev === "none" ? "pre-wrap" : "none"));
        }}
      >
        <WrapText />
      </Button>
    </div>
  );
};
/*
# Styling Guidelines
**Version 0.2**

Base16 aims to group similar language constructs with a single colour. For example, floats, ints, and doubles would belong to the same colour group. The colours for the default theme were chosen to be easily separable, but scheme designers should pick whichever colours they desire, e.g. base0B (green by default) could be replaced with red. There are, however, some general guidelines below that stipulate which base0B should be used to highlight each construct when designing templates for editors.

Since describing syntax highlighting can be tricky, please see [base16-vim](https://github.com/chriskempson/base16-vim/) and [base16-textmate](https://github.com/chriskempson/base16-textmate/) for reference. Though it should be noted that each editor will have some discrepancies due the fact that editors generally have different syntax highlighting engines.

Colours base00 to base07 are typically variations of a shade and run from darkest to lightest. These colours are used for foreground and background, status bars, line highlighting and such. colours base08 to base0F are typically individual colours used for types, operators, names and variables. In order to create a dark theme, colours base00 to base07 should span from dark to light. For a light theme, these colours should span from light to dark.

- **base00** - Default Background
- **base01** - Lighter Background (Used for status bars, line number and folding marks)
- **base02** - Selection Background
- **base03** - Comments, Invisibles, Line Highlighting
- **base04** - Dark Foreground (Used for status bars)
- **base05** - Default Foreground, Caret, Delimiters, Operators
- **base06** - Light Foreground (Not often used)
- **base07** - Light Background (Not often used)
- **base08** - Variables, XML Tags, Markup Link Text, Markup Lists, Diff Deleted
- **base09** - Integers, Boolean, Constants, XML Attributes, Markup Link Url
- **base0A** - Classes, Markup Bold, Search Text Background
- **base0B** - Strings, Inherited Class, Markup Code, Diff Inserted
- **base0C** - Support, Regular Expressions, Escape Characters, Markup Quotes
- **base0D** - Functions, Methods, Attribute IDs, Headings
- **base0E** - Keywords, Storage, Selector, Markup Italic, Diff Changed
- **base0F** - Deprecated, Opening/Closing Embedded Language Tags, e.g. `<?php ?>`
*/
