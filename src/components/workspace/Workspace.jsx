import React, { useEffect } from 'react';
import { useParams, Navigate } from 'react-router';
import EditorPane from './EditorPane'
import PDFContainer from './PDFContainer'
import Toolbar from './Toolbar';

import useTabStore from '../stores/tab.store';

function Workspace() {
  const { tabIndexParam } = useParams();
  const tabIndex = Number(tabIndexParam);
  if(Number.isNaN(tabIndex) || !Number.isInteger(tabIndex)) {
    return (
      <Navigate to="/error/404" replace />
    )
  }

  const title = useTabStore(state => state.getTabTitle(tabIndex));
  useEffect(() => {
    useTabStore.getState().ensureTab(tabIndex);
  }, [tabIndex]);

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
