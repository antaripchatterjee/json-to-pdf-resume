import React, { useEffect } from 'react'
import { useNavigate, useSearchParams, Navigate } from 'react-router'

import { useMonaco } from '@monaco-editor/react';
import {usePanelStore} from '../stores/panel.store';
import Loading from '../generic/Loading';

function NewTab() {
  const navigate = useNavigate();
  const monaco = useMonaco();
  const addTab = usePanelStore(state => state.addTab);
  const [searchParams, _] = useSearchParams();

  useEffect(() => {
    if(!searchParams) return;
    const onPanelSearchParam = searchParams.get('onPanel');
    const onPanelId = Number(onPanelSearchParam);
    if (Number.isNaN(onPanelId) || !Number.isInteger(onPanelId)) {
      console.error('Invalid panel id')
      return navigate('/error/InvalidPanelId', { replace: true })
    }
    if (monaco) {
      const newTabIndex = addTab(onPanelId, monaco, "json");
      if (!newTabIndex) {
        console.warn('Could not create a new tab');
        navigate(`/error/CouldNotCreateNewTab`, { replace: true });
      } else {
        navigate(`/workspace/${newTabIndex}?onPanel=${onPanelId}`, { replace: true })
      }
    }
  }, [searchParams, addTab, monaco, navigate])
  



  return (
    <Loading message='Creating new tab...' />
  )
}

export default NewTab