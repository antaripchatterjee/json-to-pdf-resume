import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import { InformationCircleIcon } from "@heroicons/react/24/outline";

import LabelWithTooltip from './LabelWithTooltip';

import removeKeyImmutable from '../utils/removeKeyImmutable';

function ToggleButton({ label, className, tooltip, ...props }) {
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
    <div className="relative flex flex-col font-medium">
      <LabelWithTooltip
        label={
          <span className='-mt-0.5'>
            {label}
          </span>
        }
        tooltip={tooltip}
        className="text-sm"
      />
      {/* <span className='-mt-0.5'>
        {label}
      </span>
      <button
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
            dndndndndndndndn
          </div>
        )}
      </button> */}
      <input
        type="checkbox"
        className={clsx(
          "sr-only peer",
          className
        )}
        {...removeKeyImmutable(props, 'type')}
      />
      <div className="mt-2.5 w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-theme-light-primary peer-checked:dark:bg-theme-dark-primary transition"></div>
      <div className="absolute left-1 top-8 bg-white w-4 h-4 rounded-full transition peer-checked:translate-x-5"></div>
    </div>
  )
}

ToggleButton.propTypes = {
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ]).isRequired,
  tooltip: PropTypes.string,
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  checked: PropTypes.bool.isRequired
}

export default ToggleButton;
