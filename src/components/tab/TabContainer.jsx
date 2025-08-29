import React from 'react';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import TabButtonGroup from './TabButtonGroup';
import TabContent from './TabContent';

import PageNoFound from '../errors/PageNoFound';
import Workspace from '../workspace/Workspace';
import Home from '../generic/Welcome';
import Settings from '../generic/Settings';
import Help from '../generic/Docs';


function TabContainer() {
  return (
    <BrowserRouter>
      <div className="mx-auto h-full relative">
        <TabButtonGroup />
        <div className="h-full">
          <Routes>
            <Route
              path="/"
              element={
                <Navigate 
                  to="/home" 
                  replace 
                />
              }
            />
            <Route
              path="/home"
              element={(
                <TabContent>
                  <Home />
                </TabContent>
              )}
            />
            <Route
              path="/settings"
              element={(
                <TabContent>
                  <Settings />
                </TabContent>
              )}
            />
            <Route
              path="/help"
              element={(
                <TabContent>
                  <Help />
                </TabContent>
              )}
            />
            <Route 
              path='/tabs/:tabIndexParam'
              element={
                <TabContent>
                  <Workspace />
                </TabContent>
              }
            />
            <Route
              path='*'
              element={<PageNoFound />}
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default TabContainer