import React, { useState, useEffect, useRef } from "react";

export default function SiblingDropdown({
  anchorRef,         // breadcrumb DOM ref
  open,
  onClose,
  siblings,
  onSelect,
  showSearch = false,
  withBackground = true,
  className = "",
  itemClassName = "",
}) {
  const dropdownRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [query, setQuery] = useState("");

  // Position dropdown below anchor
  useEffect(() => {
    if (anchorRef?.current && open) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPos({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
  }, [anchorRef, open]);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !anchorRef.current.contains(e.target)
      ) {
        onClose();
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose, anchorRef]);

  // Filtering siblings if search enabled
  const filtered = showSearch
    ? siblings.filter((s) =>
        s.label.toLowerCase().includes(query.toLowerCase())
      )
    : siblings;

  if (!open) return null;

  return (
    <div
      ref={dropdownRef}
      className={`absolute z-50 rounded-lg shadow-lg ${
        withBackground ? "bg-white border border-gray-200" : ""
      } ${className}`}
      style={{ top: pos.top, left: pos.left }}
    >
      {showSearch && (
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-2 border-b border-gray-200 text-sm focus:outline-none"
        />
      )}

      <ul className="max-h-60 overflow-auto">
        {filtered.map((s, idx) => (
          <DropdownItem
            key={idx}
            item={s}
            onSelect={onSelect}
            itemClassName={itemClassName}
          />
        ))}
        {filtered.length === 0 && (
          <li className="p-2 text-gray-400 text-sm">No options</li>
        )}
      </ul>
    </div>
  );
}

function DropdownItem({ item, onSelect, itemClassName }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <li
      className={`cursor-pointer px-3 py-2 hover:bg-gray-100 ${itemClassName}`}
      onClick={(e) => {
        e.stopPropagation();
        if (item.children?.length) {
          setExpanded(!expanded);
        } else {
          onSelect(item);
        }
      }}
    >
      <div className="flex justify-between items-center">
        <span>{item.label}</span>
        {item.children?.length > 0 && (
          <span className="text-xs text-gray-400">{expanded ? "−" : "+"}</span>
        )}
      </div>
      {expanded && item.children?.length > 0 && (
        <ul className="ml-4 mt-1 border-l border-gray-200 pl-2">
          {item.children.map((child, idx) => (
            <DropdownItem
              key={idx}
              item={child}
              onSelect={onSelect}
              itemClassName={itemClassName}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
