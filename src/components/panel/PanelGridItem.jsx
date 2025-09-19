import React from "react";
import clsx from "clsx";
import PanelResizer from "./PanelResizer";
import { useGridLayoutStore } from "../stores/panel.store";

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
  const { gridTemplateColumns, updatePanelGridColumnByIndex } =
    useGridLayoutStore();
  const { gridTemplateRows, updatePanelGridRowByIndex } =
    useGridLayoutStore();

  React.useEffect(() => {
    if (!gridItemRef.current) return;
    const gridTemplateColumnsCopy = [...gridTemplateColumns];

    const computedStyle = window.getComputedStyle(gridItemRef.current);
    let minWidth = parseFloat(computedStyle.minWidth);
    if (isNaN(minWidth) || minWidth < 0) {
      minWidth = 0;
    }

    const colIndex = (gridColumn?.start ?? 1) - 1;

    if (colIndex >= gridTemplateColumnsCopy.length) {
      for (let i = gridTemplateColumnsCopy.length; i <= colIndex; i++) {
        updatePanelGridColumnByIndex(
          i,
          i === colIndex ? `${minWidth}px` : "0px"
        );
      }
    } else if (minWidth > 0) {
      const currentWidth =
        gridItemRef.current.offsetWidth ||
        parseFloat(gridTemplateColumnsCopy[colIndex]);
      if (minWidth > currentWidth) {
        updatePanelGridColumnByIndex(colIndex, `${minWidth}px`);
      }
    }
  }, [gridColumn?.start, gridTemplateColumns, updatePanelGridColumnByIndex]);

  React.useEffect(() => {
    if (!gridItemRef.current) return;
    const gridTemplateRowsCopy = [...gridTemplateRows];

    const computedStyle = window.getComputedStyle(gridItemRef.current);
    let minHeight = parseFloat(computedStyle.minHeight);
    if (isNaN(minHeight) || minHeight < 0) {
      minHeight = 0;
    }

    const rowIndex = (gridRow?.start ?? 1) - 1;

    if (rowIndex >= gridTemplateRowsCopy.length) {
      for (let i = gridTemplateRowsCopy.length; i <= rowIndex; i++) {
        updatePanelGridRowByIndex(
          i,
          i === rowIndex ? `${minHeight}px` : "0px"
        );
      }
    } else if (minHeight > 0) {
      const currentHeight =
        gridItemRef.current.offsetHeight ||
        parseFloat(gridTemplateRowsCopy[rowIndex]);
      if (minHeight > currentHeight) {
        updatePanelGridRowByIndex(rowIndex, `${minHeight}px`);
      }
    }
  }, [gridRow?.start, gridTemplateRows, updatePanelGridRowByIndex]);

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
        "relative panel-grid-item !max-w-none !max-h-none",
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
