import React from 'react';
import EditorPane from './EditorPane'
import PDFContainer from './PDFContainer'

function Workspace({ tabIndex }) {
  return (
    <div className="flex h-[95%] gap-6 border-1">
      <EditorPane
        path={`workspace/tabs/${tabIndex}`}
      />
      {/* <PDFContainer
        renderPDF={renderPDF}
        parsedData={parsedData}
      /> */}
    </div>
  )
}

export default Workspace;
