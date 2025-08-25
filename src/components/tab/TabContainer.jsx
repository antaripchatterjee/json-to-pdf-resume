import React from 'react'
// import {
//   // HistoryRouter as StableHistoryRouter,
//   unstable_HistoryRouter as ExperimentalHistoryRouter
// } from "react-router";

// const UniqueHistoryRouter = ExperimentalHistoryRouter;

import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import TabButtons from './TabButtons';
import TabContent from './TabContent';
// import useTabStore from '../stores/tab.store';

import PageNoFound from '../errors/PageNoFound';
import Workspace from '../workspace/Workspace';
import Home from '../workspace/Home';
import Settings from '../workspace/Settings';
import Help from '../workspace/Help';

// import uniqueBrowserHistory from '../../utils/uniqueBrowserHistory';


function TabContainer() {
  // const { tabs } = useTabStore();
  // const history = uniqueBrowserHistory();
  return (
    <BrowserRouter /*history={history}*/>
      <div className="mx-auto h-full relative">
        <TabButtons />
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