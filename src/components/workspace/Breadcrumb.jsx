import React from 'react';
import clsx from "clsx";

function Breadcrumb({ title }) {
  return (<div
    className={clsx("w-full h-5 p-1 text-[10px] select-none monaco-component",
      "bg-[var(--vscode-editor-background)] text-[var(--vscode-editor-foreground)]"
    )}
  >
    {title} &gt; #_VERSION
  </div>)
}


export default Breadcrumb