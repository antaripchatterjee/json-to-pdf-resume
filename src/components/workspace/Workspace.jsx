import React, { useEffect } from 'react';
import { useNavigate, useParams, Navigate } from 'react-router';
import { useMonaco } from '@monaco-editor/react';
import EditorPane from './EditorPane'
import PDFContainer from './PDFContainer'
import Toolbar from './Toolbar';

import useTabStore from '../stores/tab.store';

function Workspace() {
  const monaco = useMonaco();
  const navigate = useNavigate();
  const { tabIndexParam } = useParams();
  const tabIndex = Number(tabIndexParam);
  if(Number.isNaN(tabIndex) || !Number.isInteger(tabIndex)) {
    return (
      <Navigate to="/error/404" replace />
    )
  }

  const title = useTabStore(state => state.getTabTitle(tabIndex));
  const path = useTabStore(state => state.getTabPath(tabIndex));
  
  useEffect(() => {
    if(!monaco) return;
    const model = useTabStore.getState().ensureTab(tabIndex, monaco, "json");
    if(!model) {
      navigate('/error/CouldNotCreateModel', { replace: true })
    }
  }, [tabIndex, monaco]);

  return (
    <div className='h-full'>
      <div className="flex h-full gap-6">
        <EditorPane
          title={title}
          path={path}
        />
        {/* <PDFContainer
        renderPDF={renderPDF}
        parsedData={parsedData}
      /> */}
      </div>
      <Toolbar
        title={title}
        path={path}
      />
    </div>
  )
}

export default Workspace;
