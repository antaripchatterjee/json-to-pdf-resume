// import { useEffect } from "react";
import React, { useState, useRef } from "react";

export default function CustomFontOption({ optionId, row }) {
  const [added, setAdded] = useState(false);

  const [fontFamily, setFontFamily] = useState(row?.family?.trim() ?? "");
  const editFontFamily = useRef(fontFamily === "");

  const [fontWeight, setFontWeight] = useState(row?.fontWeight ?? -1);
  const editFontWeight = useRef(fontWeight === -1);

  const [fontStyle, setFontStyle] = useState(row?.fontStyle?.trim() ?? "");
  const editFontStyle = useRef(fontStyle === "");

  return (<>
    <div className="absolute -mt-2">
      <button className={`text-[size:10px] px-2 py-1 rounded shadow transition ${added
        ? "text-theme-light-primary dark:text-theme-dark-primary" : "text-customwhite"
        } ${added ? "bg-customwhite" : "bg-theme-light-primary dark:bg-theme-dark-primary"} hover:text-white hover:bg-blue-900`}
        onClick={() => setAdded(!added)}
      >
        {added ? '- Remove' : '+ Add'}
      </button>
    </div>
    <div className="flex flex-col gap-3 w-full overflow-hidden">
      <div className="text-sm w-full">
        <label className="block text-xs text-gray-500 mb-1">
          CSS
        </label>
        <div className="relative group truncate text-blue-700 dark:text-blue-300">
          <span className="truncate block w-full hover:underline">
            {row.url}
          </span>
        </div>
      </div>

      <div className="text-sm w-full">
        <label className="block text-xs text-gray-500 mb-1">
          Formats
        </label>
        <div className="flex flex-wrap text-blue-700 dark:text-blue-300 gap-2">
          {new Array(...new Set(row.sources.map(source => source.format))).map(((format, i) => <span
              key={`${row.id}:src-${i}`}
              className="inline-flex items-center px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full"
            >
              {format}
            </span>)
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <div>
          <label className="block text-xs mb-1">Font Family</label>
          <input
            type="text"
            value={fontFamily}
            disabled={!editFontFamily.current}
            onChange={(e) => {
              if (editFontFamily.current) {
                setFontFamily(row.id, e.target.value)
              }
            }}
            className="w-full px-3 py-1.5 border rounded dark:bg-gray-700 dark:text-white disabled:dark:bg-gray-500 disabled:bg-gray-200"
            placeholder="e.g. Roboto"
          />
        </div>

        <div>
          <label className="block text-xs mb-1">Font Weight</label>
          <input
            type="number"
            value={fontWeight}
            disabled={!editFontWeight.current}
            onChange={(e) => {
              if (editFontWeight.current) {
                setFontWeight(row.id, e.target.value)
              }
            }}
            className="w-full px-3 py-1.5 border rounded dark:bg-gray-700 dark:text-white disabled:dark:bg-gray-500 disabled:bg-gray-200"
            placeholder="e.g. 400"
          />
        </div>

        <div>
          <label className="block text-xs mb-1">Font Style</label>
          <input
            type="text"
            value={fontStyle}
            disabled={!editFontStyle.current}
            onChange={(e) => {
              if (editFontStyle.current) {
                setFontStyle(row.id, e.target.value)
              }
            }}
            className="w-full px-3 py-1.5 border rounded dark:bg-gray-700 dark:text-white disabled:dark:bg-gray-500 disabled:bg-gray-200"
            placeholder="e.g. normal"
          />
        </div>
      </div>
    </div>
  </>)
}