import React, { useRef } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';


import LabelWithTooltip from './LabelWithTooltip';

import removeKeyImmutable from '../utils/removeKeyImmutable';

function ToggleButton({ label, className, tooltip, ...props }) {
  const checkboxRef = useRef(null)

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
      <div className='w-fit h-fit mt-2.5' onClick={() => {
        checkboxRef.current?.click();
      }}>
        <input
          ref={checkboxRef}
          type="checkbox"
          className={clsx(
            "sr-only peer",
            className
          )}
          {...removeKeyImmutable(props, 'type')}
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-theme-light-primary peer-checked:dark:bg-theme-dark-primary transition"></div>
        <div className="absolute left-1 top-8 bg-white w-4 h-4 rounded-full transition peer-checked:translate-x-5"></div>
      </div>
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
