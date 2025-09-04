import React from "react";
import clsx from "clsx";
import PanelResizer from "./PanelResizer";

function PanelGridItem({
  resizable = false,
  horizontallyResizable = true,
  verticallyResizable = false,
  panelId,
  panelName,
  children,
  className,
  onResize,
}) {
  return (
    <div
      className={clsx(
        "relative panel-grid-item",
        className,
        panelName ? `panel-${panelName}` : `panel-${panelId}`
      )}
    >
      {children}
      {resizable && horizontallyResizable && (
        <PanelResizer orientation="horizontal" onResize={onResize} />
      )}
      {resizable && verticallyResizable && (
        <PanelResizer orientation="vertical" onResize={onResize} />
      )}
    </div>
  );
}

export default PanelGridItem;
