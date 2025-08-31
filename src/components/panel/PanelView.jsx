import React from "react";
import { Outlet } from "react-router";
import usePanelStore from "../stores/panel.store";

function PanelView({ panelId }) {
  const isVisible = usePanelStore((s) => s.isPanelVisible(panelId));
  const setActivePanel = usePanelStore((s) => s.setActivePanel);
  if (!isVisible) return null;
  return (
    <div
      className="w-full h-full bg-muted flex items-center justify-center"
      onClick={() => setActivePanel(panelId)}
    >
      <Outlet context={{ panelId }} />
    </div>
  );
}

export default PanelView;
