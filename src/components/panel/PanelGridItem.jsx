import React from "react";
import clsx from "clsx";
import PanelResizer from "./PanelResizer";
import { useLayoutStore } from "../stores/panel.store";

function PanelGridItem({
  resizable = false,
  horizontallyResizable = true,
  verticallyResizable = false,
  panelId,
  panelName,
  children,
  className,
  gridRef,
  beforeResize,
}) {
  const gridItemRef = React.useRef(null);
  // const prevGridTemplateColumnRef = React.useRef(0);
  const { gridTemplateAreas, updatePanelGridColumnByIndex } = useLayoutStore();
  return (
    <div
      ref={gridItemRef}
      className={clsx(
        "relative panel-grid-item",
        className,
        panelName ? `panel-${panelName}` : `panel-${panelId}`
      )}
    >
      {resizable && horizontallyResizable && (
        <PanelResizer
          orientation="horizontal"
          beforeResize={beforeResize}
          onResize={(delta) => {
            const index = Array.isArray(gridTemplateAreas)
              ? gridTemplateAreas.indexOf(panelName)
              : -1;
            if (index === -1 || !gridRef?.current || !gridItemRef.current) return;
            const { width } = gridRef.current.getBoundingClientRect();
            const itemsTotalWidth = Array.from(
              gridRef.current.querySelectorAll(".panel-grid-item")
            ).reduce((acc, item) => acc + item.offsetWidth, 0);
            if(itemsTotalWidth <= 0) return;
            const newGridTemplateColumn = gridItemRef.current.offsetWidth - (itemsTotalWidth > width ? (itemsTotalWidth-width) : delta);
            // const newGridTemplateColumn = itemsTotalWidth > width ? prevGridTemplateColumnRef.current : (gridItemRef.current.offsetWidth - delta)
            console.log({width, itemsTotalWidth, newGridTemplateColumn, delta});
            updatePanelGridColumnByIndex(index, `${newGridTemplateColumn}px`);
            if(gridItemRef.current.previousElementSibling) {
              updatePanelGridColumnByIndex(index - 1, "1fr");
            }
          }}
        />
      )}
      {resizable && verticallyResizable && (
        <PanelResizer
          orientation="vertical"
          beforeResize={beforeResize}
          onResize={(delta) => {

          }}
        />
      )}
      {children}
    </div>
  );
}

export default PanelGridItem;
