import React, { useEffect, useRef } from "react";
import { Outlet, useNavigate, useMatch } from "react-router";
import { usePanelStore } from "../stores/panel.store";
import {
  RESERVED_ALL_TABS_PANEL,
  RESERVED_WORKSPACE_PANEL,
  RESERVED_PDF_PREVIEW_PANEL,
} from "../stores/panel.store";
import PanelGridItem from "./PanelGridItem";

export default function PanelGrid() {
  const gridRef = useRef(null);
  const navigate = useNavigate();

  const { panels, isPanelVisible } = usePanelStore();

  const isWorkspaceRoot = useMatch("/workspace");
  const noTabsAnywhere = panels.every((p) => !isPanelVisible(p.id));

  useEffect(() => {
    if (noTabsAnywhere && isWorkspaceRoot) {
      navigate("/welcome", { replace: true });
    }
  }, [noTabsAnywhere, isWorkspaceRoot, navigate]);

  const updateDelta = (varName, delta) => {
    if (gridRef.current) {
      gridRef.current.style.setProperty(varName, `${delta}px`);
    }
  };

  const visiblePanels = panels.filter((p) => p?.tabStack?.size > 0);
  if (visiblePanels.length === 0) {
    return <Outlet />;
  }

  return (
    <div
      ref={gridRef}
      className="h-full w-full panel-grid"
      style={{
        "--explorer-delta": "0px",
        "--workspace-delta": "0px",
      }}
    >
      <PanelGridItem
        resizable={true}
        onResize={(delta) => updateDelta("--explorer-delta", delta)}
        panelName={"explorer"}
        panelId={RESERVED_ALL_TABS_PANEL}
      >
        All Tabs
      </PanelGridItem>
      <PanelGridItem
        panelId={RESERVED_WORKSPACE_PANEL}
        resizable={true}
        onResize={(delta) => updateDelta("--workspace-delta", delta)}
        panelName={"workspace"}
      >
        Workspace
      </PanelGridItem>
      <PanelGridItem
        panelId={RESERVED_PDF_PREVIEW_PANEL}
        resizable={false}
        panelName="pdf"
      >
        PDF Preview
      </PanelGridItem>
    </div>
  );
}
