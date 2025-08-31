import React from "react";
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";
import { Outlet, useNavigate, useMatch } from "react-router";
import usePanelStore from "../stores/panel.store";
import PanelView from "./PanelView";


export default function PanelGrid() {
  const navigate = useNavigate();
  const panels = usePanelStore((s) => s.panels);
  const prefs = usePanelStore((s) => s.userPrefs);

  
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

  if (visiblePanels.length === 1) {
    return (
      <PanelGroup direction="vertical" className="w-full h-full">
        <Panel id={`panel-${visiblePanels[0].id}`} className="w-full h-full">
          <PanelView panelId={visiblePanels[0].id} />
        </Panel>
      </PanelGroup>
    );
  }

  if (visiblePanels.length === 2) {
    const dir = prefs.twoPanelMode === "horizontal" ? "horizontal" : "vertical";
    return (
      <PanelGroup direction={dir} className="w-full h-full">
        {visiblePanels.map((p, idx) => (
          <React.Fragment key={p.id}>
            {idx > 0 && <PanelResizeHandle className="bg-border w-1" />}
            <Panel id={`panel-${p.id}`} className="w-full h-full min-w-[150px] min-h-[150px]">
              <PanelView panelId={p.id} />
            </Panel>
          </React.Fragment>
        ))}
      </PanelGroup>
    );
  }

  if (visiblePanels.length === 3) {
    const mode = prefs.threePanelMode;
    if (mode === "top-split" || mode === "bottom-split") {
      return (
        <PanelGroup direction="vertical" className="w-full h-full">
          <Panel>
            {mode === "top-split" ? (
              <PanelGroup direction="horizontal">
                <Panel>
                  <PanelView panelId={visiblePanels[0].id} />
                </Panel>
                <PanelResizeHandle className="bg-border w-1" />
                <Panel>
                  <PanelView panelId={visiblePanels[1].id} />
                </Panel>
              </PanelGroup>
            ) : (
              <PanelView panelId={visiblePanels[0].id} />
            )}
          </Panel>
          <PanelResizeHandle className="bg-border h-1" />
          <Panel>
            {mode === "bottom-split" ? (
              <PanelGroup direction="horizontal">
                <Panel>
                  <PanelView panelId={visiblePanels[1].id} />
                </Panel>
                <PanelResizeHandle className="bg-border w-1" />
                <Panel>
                  <PanelView panelId={visiblePanels[2].id} />
                </Panel>
              </PanelGroup>
            ) : (
              <PanelView panelId={visiblePanels[2].id} />
            )}
          </Panel>
        </PanelGroup>
      );
    }
    // left-split / right-split
    return (
      <PanelGroup direction="horizontal" className="w-full h-full">
        <Panel>
          {mode === "left-split" ? (
            <PanelGroup direction="vertical">
              <Panel>
                <PanelView panelId={visiblePanels[0].id} />
              </Panel>
              <PanelResizeHandle className="bg-border h-1" />
              <Panel>
                <PanelView panelId={visiblePanels[1].id} />
              </Panel>
            </PanelGroup>
          ) : (
            <PanelView panelId={visiblePanels[0].id} />
          )}
        </Panel>
        <PanelResizeHandle className="bg-border w-1" />
        <Panel>
          {mode === "right-split" ? (
            <PanelGroup direction="vertical">
              <Panel>
                <PanelView panelId={visiblePanels[1].id} />
              </Panel>
              <PanelResizeHandle className="bg-border h-1" />
              <Panel>
                <PanelView panelId={visiblePanels[2].id} />
              </Panel>
            </PanelGroup>
          ) : (
            <PanelView panelId={visiblePanels[2].id} />
          )}
        </Panel>
      </PanelGroup>
    );
  }

  if (visiblePanels.length === 4) {
    return (
      <PanelGroup direction="vertical" className="w-full h-full">
        <Panel>
          <PanelGroup direction="horizontal">
            <Panel>
              <PanelView panelId={visiblePanels[0].id} />
            </Panel>
            <PanelResizeHandle className="bg-border w-1" />
            <Panel>
              <PanelView panelId={visiblePanels[1].id} />
            </Panel>
          </PanelGroup>
        </Panel>
        <PanelResizeHandle className="bg-border h-1" />
        <Panel>
          <PanelGroup direction="horizontal">
            <Panel>
              <PanelView panelId={visiblePanels[2].id} />
            </Panel>
            <PanelResizeHandle className="bg-border w-1" />
            <Panel>
              <PanelView panelId={visiblePanels[3].id} />
            </Panel>
          </PanelGroup>
        </Panel>
      </PanelGroup>
    );
  }

  return null;
}
