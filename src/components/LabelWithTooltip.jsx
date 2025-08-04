import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import clsx from 'clsx';

import { InformationCircleIcon } from "@heroicons/react/24/outline";

function LabelWithTooltip({ label, tooltip, className }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef();

  // Optional: Close tooltip if clicked outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target)) {
        setShowTooltip(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <label className={clsx(
      "relative flex gap-1",
      className
    )}>
      {label}
      {tooltip && <button
        type="button"
        onClick={() => setShowTooltip((prev) => !prev)}
        className="relative focus:outline-none"
      >
        <InformationCircleIcon className="h-4 w-4 text-gray-500 hover:text-blue-500" />
        {showTooltip && (
          <div
            ref={tooltipRef}
            className="absolute z-10 left-full ml-2 -mt-5 w-48 text-[size:9px] dark:text-white text-gray-800 dark:bg-gray-600 bg-gray-200 rounded-lg shadow-lg px-3 py-2 text-left"
          >
            {tooltip}
          </div>
        )}
      </button>}
    </label>
  );
}

LabelWithTooltip.propTypes = {
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ]).isRequired,
  tooltip: PropTypes.string,
  className: PropTypes.string,
}

export default LabelWithTooltip;

