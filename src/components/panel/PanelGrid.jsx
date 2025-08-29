import React from "react";
import { Outlet, Navigate, useMatch } from "react-router";
import GridLayout from "react-grid-layout";
import usePanelStore from "../stores/panel.store";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

function PanelGrid() {
  const panels = usePanelStore((s) => s.panels);
  const isPanelVisible = usePanelStore((s) => s.isPanelVisible);

  // Match only the exact `/workspace`
  const isWorkspaceRoot = useMatch("/workspace");
  const noTabs = panels.every((p) => p.tabs.size === 0);

  if (noTabs && isWorkspaceRoot) {
    return <Navigate to="/welcome" replace />;
  }

  // Layout: give each visible panel a grid position
  const layout = panels
    .filter((p) => isPanelVisible(p.id))
    .map((p, idx) => ({
      i: String(p.id),
      x: idx % 2, // 2 panels per row
      y: Math.floor(idx / 2),
      w: 1,
      h: 1,
    }));

  return (
    <div className="h-full w-full">
      <GridLayout
        className="layout"
        layout={layout}
        cols={2}
        rowHeight={400}
        width={1200}
      >
        {panels.map((panel) =>
          isPanelVisible(panel.id) ? (
            <div
              key={panel.id}
              className="rounded-xl shadow-md bg-white dark:bg-gray-800 p-4"
            >
              <h2 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Panel {panel.id}
              </h2>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {panel.tabs.size === 0
                  ? "No tabs here yet"
                  : `Tabs: ${Array.from(panel.tabs).join(", ")}`}
              </div>
            </div>
          ) : null
        )}
      </GridLayout>

      {/* Nested routes (NewTab, TabContent, etc.) */}
      <Outlet />
    </div>
  );
}

export default PanelGrid;
