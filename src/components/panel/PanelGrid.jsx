import React from "react";
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";
import { Outlet, useNavigate, useMatch } from "react-router";
import { usePanelStore, useLayoutStore } from "../stores/panel.store";
import { RenderGrid } from "./PanelRenderer";


export default function PanelGrid() {
  const navigate = useNavigate();
  const panels = usePanelStore((s) => s.panels);
  const layout = useLayoutStore((s) => s.layout);

  
  const isWorkspaceRoot = useMatch("/workspace");
  const noTabsAnywhere = panels.every((p) => p.tabStack.size === 0);
  
  React.useEffect(() => {
    if (noTabsAnywhere && isWorkspaceRoot) {
      navigate("/welcome", { replace: true });
    }
  }, [noTabsAnywhere, isWorkspaceRoot, navigate]);
  
  const visiblePanels = panels.filter((p) => p.tabStack.size > 0);
  if(visiblePanels.length === 0) {
    return (
      <Outlet />
    )
  }

  return (
    <RenderGrid layout={layout} /> 
  );
}
