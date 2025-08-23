import React from "react";
import clsx from "clsx";

const FONT_FALLBACK = '"Fira Code", ui-monospace, Consolas, monospace';

function TextToIcon({
  glyph,
  size = 16,
  color = "currentColor",
  weight = 700,
  italic = true,
  family = FONT_FALLBACK,
  className,
  label
}) {
  const fontSize = typeof size === "number" ? `${size}px` : size;
  return (
    <span
      role="img"
      aria-label={label || glyph}
      style={{
        display: "inline-block",
        fontFamily: family,
        fontSize,
        color,
        fontWeight: weight,
        fontStyle: italic ? "italic" : "normal",
        lineHeight: 1,
        // optional: slight skew if you want extra italic vibe
        // transform: italic ? "skewX(-8deg)" : undefined,
      }}
      className={clsx("select-none", className)}
    >
      {glyph}
    </span>
  );
}

export const LanguageJSONIcon = (props) => (
  <TextToIcon glyph="{}" label="JSON icon" {...props} />
);

export const LanguageYMLIcon = (props) => (
  <TextToIcon glyph="!" label="YAML icon" {...props} />
);

export const LanguageXMLIcon = (props) => (
  <TextToIcon glyph={"</>"} label="XML icon" {...props} />
);

export function LanguageIcon({ type = "json", ...rest }) {
  const t = type.toLowerCase();
  if (t === "yaml" || t === "yml") return <LanguageYMLIcon {...rest} />;
  if (t === "xml") return <LanguageXMLIcon {...rest} />;
  return <LanguageJSONIcon {...rest} />;
}
