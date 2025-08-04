import React from 'react';
import PropTypes from 'prop-types';

import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

const ErrorLabel = ({ errorMessage, errorSource }) => {
  return (
    <div className="inline-flex items-center gap-1 text-red-500 text-sm cursor-pointer max-w-full">
      <ExclamationTriangleIcon
        className="w-4 h-4 flex-shrink-0"
        title={`${errorSource} says: {errorMessage}`}
      />
      <span className="truncate">{errorMessage}</span>
    </div>
  )
}

ErrorLabel.propTypes = {
  errorMessage: PropTypes.string,
  errorSource: PropTypes.string
}

export default ErrorLabel;