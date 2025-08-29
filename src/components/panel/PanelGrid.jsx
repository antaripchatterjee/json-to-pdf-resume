import React from 'react'
import { Navigate } from 'react-router';

import { usePanelStore } from '../stores/panels.store';

function PanelGrid() {
  const { panels, isPanelVisible } = usePanelStore();
  const visiblePanels = panels.map(({ id }) => isPanelVisible(id));
  if (visiblePanels.length === 0) {
    return (
      <Navigate to="/welcome" replace />
    )
  }
  const gridClassName = visiblePanels.length === 1
    ? "grid-cols-1 grid-rows-1"
    : visiblePanels.length === 2
    ? "grid-cols-2 grid-rows-1"
    : "grid-cols-2 grid-rows-2";
  return (
    <div className="h-full w-full grid gap-1 p-1 bg-gray-200">
      <div className={`grid ${gridClassName} gap-1 w-full h-full`}>
        {visiblePanels.map((panel) => (
          <div key={panel.id} className="bg-white rounded shadow overflow-hidden">
            <PanelContainer panelId={panel.id} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default PanelGrid
