import React from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import PanelView from "./PanelView";


export function RenderColumn({ col }) {
  return (
    <PanelGroup direction="vertical" className="w-full h-full">
      {col.map((panelId, idx) => (
        <React.Fragment key={panelId}>
          {idx > 0 && <PanelResizeHandle className="bg-border h-1" />}
          <Panel id={`panel-${panelId}`} className="min-w-[150px] min-h-[150px]">
            <PanelView panelId={panelId} />
          </Panel>
        </React.Fragment>
      ))}
    </PanelGroup>
  );
}

export function RenderGrid({ layout }) {
  return (
    <PanelGroup direction="horizontal" className="w-full h-full">
      {layout.map((col, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && <PanelResizeHandle className="bg-border w-1" />}
          <RenderColumn col={col} />
        </React.Fragment>
      ))}
    </PanelGroup>
  );
}

