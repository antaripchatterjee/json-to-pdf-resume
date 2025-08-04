import React from "react";
import CustomFontOption from "./CustomFontOption";

export default function CustomFontOptions({
  rows,
  selectedRows,
  onToggleRow,
  familyInputs,
  weightInputs,
  styleInputs,
  onFamilyChange,
  onStyleChange,
  onWeightChange
}) {
  return (
    <div className="space-y-4 m-4">
      {rows.map((row) => (
        <div
          key={row.id}
          className={`p-4 rounded-lg border shadow-sm transition w-full max-w-full overflow-hidden ${
            selectedRows.includes(row.id)
              ? "bg-blue-50 dark:bg-blue-900 border-blue-300"
              : "bg-white dark:bg-gray-800 border-gray-300"
          }`}
        >
          <div className="flex flex-col items-end relative">
            <CustomFontOption optionId={row.id} row={row} />
          </div>
        </div>
      ))}
    </div>
  );
}
