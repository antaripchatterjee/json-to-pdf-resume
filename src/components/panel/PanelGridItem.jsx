import React from "react";
import clsx from "clsx";
import PanelResizer from "./PanelResizer";

function PanelGridItem({
  gridRef,
  resizable = false,
  horizontallyResizable = true,
  verticallyResizable = false,
  children,
  panelName,
  gridRow,
  gridColumn,
  className,
}) {
  const gridItemRef = React.useRef(null);
  
  return (
    <div
      ref={gridItemRef}
      style={{
        gridRowStart: gridRow?.start,
        gridRowEnd: gridRow?.end,
        gridColumnStart: gridColumn?.start,
        gridColumnEnd: gridColumn?.end,
      }}
      className={clsx(
        "relative panel-grid-item",
        className,
        `panel-${panelName}`
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
