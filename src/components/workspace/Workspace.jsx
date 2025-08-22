import React from 'react';
import EditorPane from './EditorPane'
import PDFContainer from './PDFContainer'
import Toolbar from './Toolbar';

function Workspace({ tabIndex, title }) {
  return (
    <div className='h-full'>
      <div className="flex h-full gap-6">
        <EditorPane
          path={`workspace/tabs/${tabIndex}`}
        />
        {/* <PDFContainer
        renderPDF={renderPDF}
        parsedData={parsedData}
      /> */}
      </div>
      <Toolbar
        title={title}
      />
    </div>
  )
}

export default Workspace;
