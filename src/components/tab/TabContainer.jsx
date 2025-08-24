import React from 'react'
// import {
//   // HistoryRouter as StableHistoryRouter,
//   unstable_HistoryRouter as ExperimentalHistoryRouter
// } from "react-router";

// const UniqueHistoryRouter = ExperimentalHistoryRouter;

import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import TabButtons from './TabButtons';
import TabContent from './TabContent';
import useTabStore from '../stores/tab.store';

import PageNoFound from '../errors/PageNoFound';
import Workspace from '../workspace/Workspace';

// import uniqueBrowserHistory from '../../utils/uniqueBrowserHistory';


function TabContainer() {
  const { tabs } = useTabStore();
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
                    <Workspace 
                      tabIndex={key} 
                      title={value} 
                    />
                  </TabContent>
                )}
              />
            )}
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