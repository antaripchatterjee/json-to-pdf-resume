import React, { useState, useRef, useEffect } from 'react'
import clsx from 'clsx'
import useTabStore from '../stores/tab.store'

function TabButton({ tabIndex, label, onClick }) {
  const { removeTab, updateTab, setActiveTab, activeTabIndex } = useTabStore();

  const [editable, setEditable] = useState(false);
  const [tempLabel, setTempLabel] = useState(label);
  const spanRef = useRef(null);

  // Handle outside clicks
  useEffect(() => {
    if (!editable) return;

    function handleClickOutside(e) {
      if (spanRef.current && !spanRef.current.contains(e.target)) {
        setEditable(false);
        handleCommit();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [editable]);

  // Commit edits
  const handleCommit = () => {
    const newLabel = spanRef.current?.innerText.trim();
    if (newLabel && newLabel !== label) {
      setTempLabel(newLabel);
      updateTab(tabIndex, newLabel);
    } else {
      spanRef.current.innerText = label; // restore DOM directly
      setTempLabel(label);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setEditable(false);
      handleCommit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setEditable(false);
      spanRef.current.innerText = label; // restore DOM directly
      setTempLabel(label);
    }
  };

  return (
    <button
      onClick={(e) => {
        onClick();
        setActiveTab(tabIndex);
      }}
      onDoubleClick={() => {
        setEditable(true);
        setTimeout(() => {
          const range = document.createRange();
          const sel = window.getSelection();
          range.selectNodeContents(spanRef.current);
          range.collapse(false); // move caret to end
          sel.removeAllRanges();
          sel.addRange(range);
          spanRef.current?.focus();
        }, 0);
      }}
      title={label}
      className={clsx(
        "flex-shrink-0 flex justify-start px-4 py-2 w-40",
        "rounded font-medium text-sm relative text-whitesmoke hover:bg-gray-600",
        "shadow-lg tab-btn",
        activeTabIndex === tabIndex ?
          "dark:bg-theme-light-primary bg-theme-dark-primary" :
          "bg-theme-light-primary dark:bg-theme-dark-primary"
      )}
    >
      <span
        onClick={(e) => {
          e.stopPropagation();
          removeTab(tabIndex);
        }}
        className={
          clsx("font-bold absolute right-4 top-0.5 hover:scale-150",
            activeTabIndex === tabIndex ? "" : "hidden"
          )
        }
      >
        &times;
      </span>

      {/* Editable Label */}
      <span
        ref={spanRef}
        contentEditable={editable}
        suppressContentEditableWarning={true}
        onKeyDown={handleKeyDown}
        className={clsx(
          "inline-block text-[12px] max-w-3/4 outline-none p-0.5",
          editable ? "underline bg-white text-blue-950 font-bold" : "truncate"
        )}
      >
        {tempLabel}
      </span>
    </button>
  )
}

export default TabButton
