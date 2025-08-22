import React from "react";
import {
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  CommandLineIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/solid";
import clsx from "clsx";

function Toolbar({
  title,
  errors = [],
  warnings = [],
  line = 1,
  column = 1,
  selectionCount = 0,
  indentation = 2,
  setIndentation,
  encoding = "UTF-8",
  lineEnding = "LF",
  language = "json",
  setLanguage,
  onOpenCommandPalette,
  overwrite = false,
  toggleOverwrite,
}) {
  return (
    <div className="flex items-center justify-between w-full h-7 px-3 bg-theme-light-primary dark:bg-theme-dark-primary text-xs text-whitesmoke dark:text-white">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <span className="font-medium">{title}</span>

        <button
          className="flex items-center gap-1 hover:text-red-600"
          onClick={() => alert("TODO: show error modal")}
        >
          <ExclamationCircleIcon className="w-4 h-4 text-red-500" />
          {errors.length > 9 ? "9+" : errors.length}
        </button>

        <button
          className="flex items-center gap-1 hover:text-yellow-600"
          onClick={() => alert("TODO: show warning modal")}
        >
          <ExclamationTriangleIcon className="w-4 h-4 text-yellow-500" />
          {warnings.length > 9 ? "9+" : warnings.length}
        </button>
      </div>

      {/* Middle */}
      <div className="flex items-center gap-4">
        <span>Ln {line}, Col {column}</span>
        {selectionCount > 0 && <span>Sel {selectionCount}</span>}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Indentation */}
        <select
          className="bg-transparent border-none outline-none"
          value={indentation}
          onChange={(e) => setIndentation?.(Number(e.target.value))}
        >
          <option value={2}>2 Spaces</option>
          <option value={4}>4 Spaces</option>
          <option value={8}>8 Spaces</option>
        </select>

        {/* Encoding */}
        <span>{encoding}</span>

        {/* Line ending */}
        <span>{lineEnding}</span>

        {/* Language */}
        <select
          className="bg-transparent border-none outline-none"
          value={language}
          onChange={(e) => setLanguage?.(e.target.value)}
        >
          <option value="json">JSON</option>
          <option value="yaml">YAML</option>
          <option value="xml">XML</option>
        </select>

        {/* Command palette */}
        <button
          className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded"
          onClick={onOpenCommandPalette}
        >
          <CommandLineIcon className="w-4 h-4" />
        </button>

        {/* Insert/Overwrite toggle */}
        <button
          className={clsx(
            "flex items-center gap-1",
            overwrite
              ? "bg-blue-600 text-white"
              : "hover:bg-zinc-200 dark:hover:bg-zinc-700"
          )}
          onClick={toggleOverwrite}
        >
          <PencilSquareIcon className="w-4 h-4" /> 
          {overwrite ? "OVR" : "INS"}
        </button>
      </div>
    </div>
  );
}

export default Toolbar;
