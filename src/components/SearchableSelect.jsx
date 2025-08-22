import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";

export default function SearchableSelect({
  label = "Select Option",
  onChange,
  options,
  optionKeyPrefix,
  placeholder = "Search...",
  size = 10
}) {
  const firstSelectableIndex = options.findIndex(option => 
    option?.selectable !== false) || 0;
  const initialQueryValue = (options.find(option => option.selected) || options[firstSelectableIndex])?.label ?? "";
  const [query, setQuery] = useState("");
  const [isListBoxOpen, setIsListBoxOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState([...options]);
  const [currentSuggestion, setCurrentSuggestion] = useState("");
  const inputRef = useRef(null);
  const selectRef = useRef(null);

  useEffect(() => {
    setQuery(initialQueryValue)
  }, [initialQueryValue])

  // Filter when query changes
  useEffect(() => {
    const filtered = query
      ? [
          ...(options.slice(0, firstSelectableIndex)),
          ...(options.slice(firstSelectableIndex).filter(opt =>
            opt.label.toLowerCase().startsWith(query.toLowerCase())
          ))
        ] : options;

    const suggestion = query && 
      filtered.length > firstSelectableIndex 
        ? filtered[firstSelectableIndex].label : "";

    setFilteredOptions(filtered);
    setCurrentSuggestion(suggestion);
  }, [query]);

  useEffect(() => {
    if (!isListBoxOpen) {
      setCurrentSuggestion("");
    }
  }, [isListBoxOpen]);

  function handleSelect(e) {
    setIsListBoxOpen(false);
    const selectedOption = e.target.options[e.target.selectedIndex];
    onChange({
      selectedIndex: e.target.selectedIndex,
      selectedOption
    }).then(v => {
      if(v && v.query) {
        setQuery(v.query)}
    });
  }

  function handleOptionSelection(e) {
    if (filteredOptions.length <= firstSelectableIndex) return;
    let changeSuggestion = false;
    let changeOption = false;

    if (e.type === "focus") {
      e.target.selectedIndex = firstSelectableIndex;
      changeSuggestion = true;
    } else if (e.type === "keydown" && e.key === "ArrowDown") {
      e.preventDefault();
      e.target.selectedIndex = e.target.selectedIndex >= filteredOptions.length - 1
        ? firstSelectableIndex
        : e.target.selectedIndex + 1;
      changeSuggestion = true;
    } else if (e.type === "keydown" && e.key === "ArrowUp") {
      e.preventDefault();
      e.target.selectedIndex = e.target.selectedIndex <= firstSelectableIndex
          ? filteredOptions.length - 1
          : e.target.selectedIndex - 1;
      changeSuggestion = true;
    } else if (e.type === "keydown" && (e.key === "Enter" || e.key === "Tab")) {
      e.preventDefault();
      changeOption = true;
    }

    if (changeSuggestion) {
      setCurrentSuggestion(
        e.target.options[e.target.selectedIndex]?.textContent || ""
      );
    } else if (changeOption) {
      const changeEvent = new Event("change", { bubbles: true });
      selectRef.current.dispatchEvent(changeEvent);
    }
  }

  return (
    <label className="flex flex-col text-sm font-medium">
      <span>{label}</span>
      <div
        className="relative w-48"
        tabIndex={-1}
        onFocus={() => setIsListBoxOpen(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) {
            setIsListBoxOpen(false);
          }
        }}
      >
        {isListBoxOpen && filteredOptions.length > 0 && (
          <select
            ref={selectRef}
            size={Math.min(
              Math.max(filteredOptions.length, 2),
              size
            )}
            onFocus={handleOptionSelection}
            onKeyDown={handleOptionSelection}
            onChange={handleSelect}
            className="absolute left-0 top-full w-full border border-gray-300 rounded bg-white dark:bg-black dark:text-customwhite capitalize z-10"
          >
            {filteredOptions.map((opt, idx) => (
              <option
                key={`${optionKeyPrefix}-${idx}`}
                className="capitalize"
                value={opt.value}
              >
                {opt.label}
              </option>
            ))}
          </select>
        )}

        {currentSuggestion && isListBoxOpen && (
          <span className="mt-[5px] ml-[0.8px] absolute top-1 left-2 text-gray-700 pointer-events-none select-none z-30">
            {currentSuggestion}
          </span>
        )}

        <input
          ref={inputRef}
          type="text"
          className="mt-1 w-full border border-gray-300 rounded px-2 py-1 capitalize bg-white text-black dark:bg-black dark:text-customwhite relative z-20 font-medium"
          placeholder={currentSuggestion ? null : placeholder}
          value={query}
          enterKeyHint="next"
          onFocus={(e) => {
            if (!e.target.value.length) setCurrentSuggestion("");
            setQuery(e.target.value);
          }}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown" || e.key === "ArrowUp") {
              e.preventDefault();
              selectRef.current.focus();
            } else if (e.key === "Enter" || e.key === "Tab") {
              e.preventDefault();
              selectRef.current.selectedIndex = 1;
              inputRef.current.blur();
              const changeEvent = new Event("change", { bubbles: true });
              selectRef.current.dispatchEvent(changeEvent);
            }
          }}
        />
      </div>
    </label>
  );
}

SearchableSelect.propTypes = {
  label: PropTypes.string,
  // value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      action: PropTypes.string // optional special action key
    })
  ).isRequired,
  optionKeyPrefix: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  size: PropTypes.number
};
