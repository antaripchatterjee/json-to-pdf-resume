import React from "react";
import clsx from "clsx";
import PanelResizer from "./PanelResizer";

function PanelGridItem({
  gridRef,
  resizable = false,
  horizontallyResizable = true,
  verticallyResizable = false,
  children,
  gridRow,
  gridColumn,
  className,
}) {
  const gridItemRef = React.useRef(null);
  
  return (
    <div
      ref={gridItemRef}
      style={{
        // gridArea: panelName || `panel_${panelId}`,
        gridRowStart: gridRow?.start,
        gridRowEnd: gridRow?.end,
        gridColumnStart: gridColumn?.start,
        gridColumnEnd: gridColumn?.end,
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
        />
      )}
      {resizable && verticallyResizable && (
        <PanelResizer
          orientation="vertical"
          gridRef={gridRef}
          gridItemRef={gridItemRef}
        />
      )}
      {children}
    </div>
  );
}

export default PanelGridItem;
