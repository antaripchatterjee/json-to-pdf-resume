import React from "react";
import {
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  CommandLineIcon,
  PencilSquareIcon,
  CodeBracketIcon,
  ArrowsRightLeftIcon,
  ArrowDownTrayIcon
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
    <div className="flex items-center justify-between min-w-full w-fit min-h-7 h-fit px-3 bg-zinc-300 dark:bg-gray-800 text-xs text-gray-800 dark:text-gray-50">
      {/* Left side */}
      <div className="flex items-center gap-3 flex-wrap">
        <button className="flex items-center gap-1"
          onClick={() => alert(`TODO: download ${title}`)}
        >
          <ArrowDownTrayIcon className="h-4 w-4 hover:text-blue-700" />
          <span className="inline-block max-w-25 truncate">
            {title}
          </span>
        </button>
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-1 hover:text-red-600"
            onClick={() => alert("TODO: show error modal")}
          >
            <ExclamationCircleIcon className="w-4 h-4 text-red-600" />
            {errors.length > 9 ? "9+" : errors.length}
          </button>

          <button
            className="flex items-center gap-1 hover:text-yellow-600"
            onClick={() => alert("TODO: show warning modal")}
          >
            <ExclamationTriangleIcon className="w-4 h-4 text-yellow-600" />
            {warnings.length > 9 ? "9+" : warnings.length}
          </button>
        </div>
      </div>

      {/* Middle */}
      <div className="flex items-center gap-4">
        <span>Ln {line}, Col {column}</span>
        {selectionCount > 0 && <span>Sel {selectionCount}</span>}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">

        <div className="flex flex-wrap gap-4">
          <span>{encoding}</span>
          <span>{lineEnding}</span>
        </div>
        {/* Indentation */}
        <div className="flex gap-1">
          <ArrowsRightLeftIcon className="h-4 w-4" />
          <select
            className="bg-transparent border-none outline-none"
            value={indentation}
            onChange={(e) => setIndentation?.(Number(e.target.value))}
          >
            <option value={2}>2 Spaces</option>
            <option value={4}>4 Spaces</option>
            <option value={8}>8 Spaces</option>
          </select>
        </div>

        {/* Language */}
        <div className="flex gap-1">
          <CodeBracketIcon className="h-4 w-4" />
          <select
            className="bg-transparent border-none outline-none"
            value={language}
            onChange={(e) => setLanguage?.(e.target.value)}
          >
            <option value="json">JSON</option>
            <option value="yaml">YAML</option>
            <option value="xml">XML</option>
          </select>
        </div>

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
