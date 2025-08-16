import React, { useEffect } from "react";
import clsx from "clsx";

function TabMenu({ x, y, isOpen, onClose }) {
  // close menu on outside click or ESC
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
      style={{ bottom: y, left: x }}
      className={clsx(
        "absolute z-50 w-40 rounded-lg shadow-lg border",
        "bg-white border-gray-200 text-gray-800",
        "dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
      )}
    >
      <ul className="py-1">
        <li
          className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
          onClick={() => {
            console.log("New Resume");
            onClose();
          }}
        >
          New Resume
        </li>
        <hr className="border-gray-200 dark:border-gray-700" />
        <li
          className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
          onClick={() => {
            console.log("Settings");
            onClose();
          }}
        >
          Settings
        </li>
        <li
          className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
          onClick={() => {
            console.log("Help");
            onClose();
          }}
        >
          Help
        </li>
      </ul>
    </div>
  );
}

export default TabMenu;
