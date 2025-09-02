import React from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import PanelView from "./PanelView";
import AutoIncrementalPanelIndex from "../stores/utils/autoIncrementalPanelIndex";

function RenderLayout({ layout, orientation, path }) {

  const key = AutoIncrementalPanelIndex.getNext();

  // Case 1: Integer → simple Panel
  if (typeof layout === "number") {
    return (
      <Panel key={`panel-${key}`}>
        <div className="h-full w-full flex items-center justify-center bg-gray-100 border">
          Panel {layout}
        </div>
      </Panel>
    );
  }

  // Case 2: Array → wrap PanelGroup inside a Panel
  if (Array.isArray(layout)) {
    // keep the same orientation we got from the parent

    return (
      <Panel key={key}>
        <PanelGroup direction={orientation}>
          {layout.map((child, i) => (
            <React.Fragment key={`${key}-${i}`}>
              <RenderLayout
                layout={child}
                orientation={
                  orientation === "horizontal" 
                  ? "vertical" : "horizontal"
                }
                path={[...path, i]}
              />
              {i < layout.length - 1 && <PanelResizeHandle />}
            </React.Fragment>
          ))}
        </PanelGroup>
      </Panel>
    );
  }

  return null;
}

export default function PanelRenderer({ layout }) {
  return (
    <div className="h-screen w-screen">
      <PanelGroup direction="horizontal">
        {layout.map((child, i) => (
          <React.Fragment key={`root-${i}`}>
            <RenderLayout layout={child} orientation="vertical" path={[i]} />
            {i < layout.length - 1 && <PanelResizeHandle />}
          </React.Fragment>
        ))}
      </PanelGroup>
    </div>
  );
}
