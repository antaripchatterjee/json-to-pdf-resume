import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import TabButtons from './TabButtons';
import TabContent from './TabContent';
import useTabStore from '../stores/tab.store';

import Workspace from '../workspace/Workspace';

function TabContainer() {
  const { tabs } = useTabStore()
  return (
    <BrowserRouter>
      <div className="mx-auto h-full relative">
        <div className="p-4 h-full">
          <Routes>
            <Route
              path="/"
              element={
                <Navigate 
                  to="/tabs/home" 
                  replace 
                />
              }
            />
            <Route
              path="/tabs/home"
              element={(
                <TabContent>
                  <div className='text-gray-900 font-bold'>
                    Home Tab
                  </div>
                </TabContent>
              )}
            />
            <Route
              path="/tabs/settings"
              element={(
                <TabContent>
                  <div className='text-gray-900 font-bold'>
                    Settings Tab
                  </div>
                </TabContent>
              )}
            />
            <Route
              path="/tabs/help"
              element={(
                <TabContent>
                  <div className='text-gray-900 font-bold'>
                    Help Tab
                  </div>
                </TabContent>
              )}
            />
            {[...tabs].map(([key, value]) =>
              <Route
                path={`/tabs/${key}`}
                key={`tab-route-${key}`}
                element={(
                  <TabContent title={value}>
                    <Workspace tabIndex={key} />
                  </TabContent>
                )}
              />
            )}
            <Route
              path='*'
              element={
                <h1>Could not find what you are looking for!</h1>
              }
            />
          </Routes>
        </div>
        <TabButtons />
      </div>
    </BrowserRouter>
  )
}

export default TabContainer