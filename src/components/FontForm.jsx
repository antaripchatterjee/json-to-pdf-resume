import React, { useState, useEffect, useRef } from "react";
import CustomFontOptions from "./CustomFontOptions";

export default function FontForm({ rows, onLoad }) {
  const [selected, setSelected] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [familyInputs, setFamilyInputs] = useState({});
  const [weightInputs, setWeightInputs] = useState({});
  const [styleInputs, setStyleInputs] = useState({});

  const manuallyToggled = useRef(false);
  
  
  const handleFamilyChange = (id, value) =>
    setFamilyInputs((prev) => ({ ...prev, [id]: value }));
  const handleWeightChange = (id, value) =>
    setWeightInputs((prev) => ({ ...prev, [id]: value }));
  const handleStyleChange = (id, value) =>
    setStyleInputs((prev) => ({ ...prev, [id]: value }));

  const toggleRow = (id, cond = null) => {
    if (cond === null) {
      setSelected((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      );
    } else {
      setSelected((prev) =>
        cond ? Array.from(new Set([...prev, id])) : prev.filter((i) => i !== id)
      );
    }
  };

  const handleSubmit = () => {
    const selectedFonts = rows
      .filter((r) => selected.includes(r.id))
      .map((r) => ({
        family: familyInputs[r.id],
        weight: weightInputs[r.id],
        style: styleInputs[r.id],
        src: r.src,
        url: r.url,
      }));

    const grouped = {};
    selectedFonts.forEach((font) => {
      if (!grouped[font.family]) {
        grouped[font.family] = {
          family: font.family,
          src: [],
        };
      }
      grouped[font.family].src.push(font.src);
    });

    onLoad(Object.values(grouped));
  };

  // 🔁 Watch when selectAll is manually toggled
  useEffect(() => {
    if (manuallyToggled.current) {
      manuallyToggled.current = false;
      if (selectAll) {
        setSelected(rows.map((r) => r.id));
      } else {
        setSelected([]);
      }
    }
  }, [selectAll, rows]);

  // ✅ Auto-sync selectAll if user is not interacting with it
  useEffect(() => {
    const allSelected = rows.length > 0 && rows.every((r) => selected.includes(r.id));
    if (selectAll !== allSelected && !manuallyToggled.current) {
      setSelectAll(allSelected);
    }
  }, [selected, rows]);

  return (
    <>
      {/* <div className="flex items-start gap-3 py-2">
        <input
          type="checkbox"
          checked={selectAll}
          onChange={() => {
            manuallyToggled.current = true;
            setSelectAll(!selectAll);
          }}
          className="w-4 h-4 accent-theme-light-primary dark:accent-theme-dark-primary shrink-0"
        />
        <label className="block text-xs">Select All</label>
      </div> */}

      <div className="overflow-y-auto max-h-64 scrollbar-thin scrollbar-thumb-rounded-md scrollbar-thumb-gray-400 scrollbar-track-gray-100">
        <CustomFontOptions
          rows={rows}
          selectedRows={selected}
          onToggleRow={toggleRow}
          familyInputs={familyInputs}
          weightInputs={weightInputs}
          styleInputs={styleInputs}
          onFamilyChange={handleFamilyChange}
          onWeightChange={handleWeightChange}
          onStyleChange={handleStyleChange}
        />

      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={handleSubmit}
          disabled={selected.length === 0}
          className="bg-theme-light-primary dark:bg-theme-dark-primary text-white px-6 py-2 rounded font-semibold hover:bg-blue-900 transition disabled:opacity-50"
        >
          Register All
        </button>
      </div>
    </>
  );
}
