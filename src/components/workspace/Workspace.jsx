import React, { useEffect, useRef } from 'react';
import EditorPane from './EditorPane'
import PDFContainer from './PDFContainer'
import Toolbar from './Toolbar';

import useTabStore from '../stores/tab.store'; 

function Workspace({ tabIndex, title }) {
  const workspaceRef = useRef(null);
  const setActiveTab = useTabStore(state => state.setActiveTab);
  useEffect(() => {
    if(workspaceRef.current) {
      console.log(`Workspace tab ${tabIndex}`)
      setActiveTab(tabIndex)
    } else {
      workspaceRef.current = tabIndex;
    }
  }, [])
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
