import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

import removeKeyImmutable from "../utils/removeKeyImmutable";

export default function IconButton({
  icon,
  label,
  ...props
}) {
  return (
    <button
      className={clsx(
        "bg-theme-light-primary dark:bg-theme-dark-primary text-white font-semibold px-4 py-2 rounded hover:bg-blue-900 dark:hover:bg-blue-600 transition disabled:opacity-50 inline-flex items-center gap-2",
        props?.className ?? ""
      )}
      {...removeKeyImmutable(props, 'className')}
    >
      {icon && <span className="icon">{icon}</span>}
      {label}
    </button>
  );
}

IconButton.propTypes = {
  icon: PropTypes.element,
  label: PropTypes.string
};
