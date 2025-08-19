import React from 'react'
import PropTypes from 'prop-types'

import JSONEditor from './JSONEditor'
import PDFContainer from './PDFContainer'

function Workspace({ tabIndex }) {
  return (
    <div className="flex h-[95%] gap-6 border-1">
      <JSONEditor
        tabIndex={tabIndex}
      />
      {/* <PDFContainer
        renderPDF={renderPDF}
        parsedData={parsedData}
      /> */}
    </div>
  )
}

Workspace.propTypes = {
  // title: PropTypes.string.isRequired()
}

export default Workspace;
