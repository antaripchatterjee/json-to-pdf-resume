import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import clsx from 'clsx';
import useTabStore from '../stores/tab.store';

function TabButton({ tabIndex, label, onClick }) {
  const navigate = useNavigate();
  const { removeTab, updateTab, setActiveTab, getActiveTab } = useTabStore();

  const activeTabIndex = getActiveTab();
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
      e.target.scrollLeft = 0;
      setEditable(false);
      handleCommit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      e.target.scrollLeft = 0;
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
        "font-medium text-sm text-gray-800 dark:text-gray-50 hover:font-bold",
        "shadow-lg tab-btn",
        activeTabIndex === tabIndex ?
          "bg-zinc-300 dark:bg-slate-700" :
          "bg-zinc-200 dark:bg-slate-800"
      )}
    >
      <span
        ref={spanRef}
        contentEditable={editable}
        suppressContentEditableWarning={true}
        onKeyDown={handleKeyDown}
        className={clsx(
          "inline-block text-[12px] w-10/12 outline-none p-0.5 text-start",
          editable ? 
            "overflow-x-scroll overflow-y-hidden whitespace-nowrap scrollbar-hidden bg-white text-gray-800" 
            : "truncate"
        )}
      >
        {tempLabel}
      </span>

      <span
        onClick={(e) => {
          e.stopPropagation();
          const {navigateTo, shouldNavigate} = removeTab(tabIndex);
          console.log(`After deleting tab ${tabIndex} you should${!shouldNavigate && ' not' || ''} navigate to index ${navigateTo}.`)
          if(shouldNavigate) {
            if(navigateTo) {
              // navigate(-1);
              navigate(`/tabs/${navigateTo}`)
            } else {
              navigate('/tabs/home')
            }
          }
        }}
        className={
          clsx("flex-1 justify-self-end font-bold hover:scale-150",
            activeTabIndex === tabIndex ? "" : "hidden"
          )
        }
      >
        &times;
      </span>
    </button>
  )
}

export default TabButton
