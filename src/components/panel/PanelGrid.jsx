import React from "react";
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";
import { Outlet, useNavigate, useMatch } from "react-router";
import { usePanelStore } from "../stores/panel.store";
import PanelRenderer from "./PanelRenderer";

const isObject = (o) => o instanceof Object && o !== null && !Array.isArray(o);
const isArray = (a) => Array.isArray(a);
const isInteger = (v) => Number.isInteger(v);

const normalizeLayout = (node) => {
  if (isInteger(node)) return node; // don't wrap here; parent decides

  if (isArray(node)) {
    const children = node.map(normalizeLayout); // normalize recursively
    const hasArrayChild = children.some(isArray); // mixed? (any arrays present)

    if (!hasArrayChild) return children; // all numbers → leave as-is

    // At least one child is an array → make all children arrays
    return children.map((child) => (isArray(child) ? child : [child]));
  }

  return node; // ignore anything else
}

const panelsToLayout = (panels) => {
  return panels.map((item) => {
    if (isObject(item)) {
      return item.id; // replace object with its id
    } else if (isArray(item)) {
      return panelsToLayout(item).filter(item => !!item);
    }
    return null;
  }).filter(i => !!i);
}


export default function PanelGrid() {
  const navigate = useNavigate();
  const panels = usePanelStore((s) => s.panels);
  const layout = panelsToLayout(panels);

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
    <PanelRenderer layout={normalizeLayout(layout)} /> 
  );
}
