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
  gridRef
}) {
  const gridItemRef = React.useRef(null);
  
  return (
    <div
      ref={gridItemRef}
      style={{
        gridArea: panelName || `panel_${panelId}`,
      }}
      className={clsx(
        "relative panel-grid-item",
        className
      )}
    >
      {resizable && horizontallyResizable && (
        <PanelResizer
          orientation="horizontal"
          gridRef={gridRef}
          gridItemRef={gridItemRef}
          panelName={panelName || `panel_${panelId}`}
        />
      )}
      {resizable && verticallyResizable && (
        <PanelResizer
          orientation="vertical"
          gridRef={gridRef}
          gridItemRef={gridItemRef}
          panelName={panelName || `panel_${panelId}`}
        />
      )}
      {children}
    </div>
  );
}

export default PanelGridItem;
