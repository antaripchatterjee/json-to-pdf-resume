import React, { useEffect } from "react";
import clsx from "clsx";
import { useNavigate } from "react-router";


function TabMenu({ menuPos, isOpen, onClose }) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleClick = () => onClose();
    const handleEsc = (e) => e.key === "Escape" && onClose();

    if (isOpen) {
      document.addEventListener("click", handleClick);
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;


  return (
    <div
      className={clsx("fixed z-50 w-44 rounded-lg shadow-lg border",
        "bg-white border-gray-200 text-gray-800",
        "dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100")}
      style={{ 
        top: `${menuPos.y - 160}px`, 
        left: `${Math.max(20, menuPos.x - 176)}px` 
      }}
    >
      <button
        className={clsx("block w-full text-left px-4 py-2 text-sm", 
          "hover:bg-gray-100 dark:hover:bg-gray-700")}
        onClick={() => {
          onClose();
          navigate('/tabs/home');
        }}
      >
        Home
      </button>
      <button
        className={clsx("block w-full text-left px-4 py-2 text-sm", 
          "hover:bg-gray-100 dark:hover:bg-gray-700")}
        onClick={() => {
          onClose();
          // navigate('/tabs/home');
        }}
      >
        New Resume
      </button>

      <hr className="my-1 border-gray-300 dark:border-gray-600" />

      <button
        className={clsx("block w-full text-left px-4 py-2 text-sm", 
          "hover:bg-gray-100 dark:hover:bg-gray-700")}
        onClick={() => {
          onClose();;
          navigate('/tabs/settings');
        }}
      >
        Settings
      </button>

      <button
        className={clsx("block w-full text-left px-4 py-2 text-sm", 
          "hover:bg-gray-100 dark:hover:bg-gray-700")}
        onClick={() => {
          onClose();
          navigate('/tabs/help');
        }}
      >
        Help
      </button>
    </div>
  );
}

export default TabMenu;
