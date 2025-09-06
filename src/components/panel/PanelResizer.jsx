import React, { useRef } from "react";
import clsx from "clsx";
import { useGridLayoutStore } from "../stores/panel.store";

function PanelResizer({ orientation = "horizontal", gridRef, gridItemRef }) {
  const startPosRef = useRef(0);
  const { gridTemplateColumns, gridTemplateRows } = useGridLayoutStore();
  const { updatePanelGridColumnByIndex, updatePanelGridRowByIndex } =
    useGridLayoutStore();
  const { updateGridTemplateColumns, updateGridTemplateRows } =
    useGridLayoutStore();

  if (orientation !== "horizontal" && orientation !== "vertical") {
    return null;
  }
  const beforeResize = () => {
    if (!gridRef.current) return;
    const children = Array.from(
      gridRef.current.querySelectorAll(".panel-grid-item")
    );
    if (orientation === "horizontal") {
      const newGridTemplateColumns = children.map((child) => {
        const width = child.offsetWidth;
        return `${width}px`;
      });
      updateGridTemplateColumns(newGridTemplateColumns);
    } else {
      const newGridTemplateRows = children.map((child) => {
        const height = child.offsetHeight;
        return `${height}px`;
      });
      updateGridTemplateRows(newGridTemplateRows);
    }
  };

  const onResize = (delta) => {
    if (!gridRef?.current || !gridItemRef.current) return;
    const computerStyle = window.getComputedStyle(gridItemRef.current);
    const { width, height } = gridRef.current.getBoundingClientRect();
    if (orientation === "horizontal") {
      const itemsTotalWidth = Array.from(
        gridRef.current.querySelectorAll(".panel-grid-item")
      ).reduce((acc, item) => acc + item.offsetWidth, 0);
      if (itemsTotalWidth <= 0) return;
      const gridColumnStart = parseInt(
        computerStyle.getPropertyValue("grid-column-start").trim(),
        10
      );
      const gridColumnEnd = parseInt(
        computerStyle.getPropertyValue("grid-column-end").trim(),
        10
      );
      if (gridColumnStart <= 1 || gridColumnEnd < -1) return;
      const newGridTemplateColumn =
        gridItemRef.current.offsetWidth -
        (itemsTotalWidth > width ? itemsTotalWidth - width : delta);
      const startIndex = gridColumnStart - 1;
      const distributedWidth =
        newGridTemplateColumn /
        (gridColumnEnd === -1
          ? gridTemplateColumns.slice(startIndex)
          : gridTemplateColumns.slice(startIndex, gridColumnEnd - 1)
        ).length;
      [...gridTemplateColumns].forEach((_, index) => {
        if (
          index >= startIndex &&
          (gridColumnEnd === -1 || index < gridColumnEnd - 1)
        ) {
          updatePanelGridColumnByIndex(index, `${distributedWidth}px`);
        } else if (index === startIndex - 1) {
          updatePanelGridColumnByIndex(index, "1fr");
        }
      });
    } else {
      const itemsTotalHeight = Array.from(
        gridRef.current.querySelectorAll(".panel-grid-item")
      ).reduce((acc, item) => acc + item.offsetHeight, 0);
      if (itemsTotalHeight <= 0) return;
      const gridRowStart = parseInt(
        computerStyle.getPropertyValue("grid-row-start").trim(),
        10
      );
      const gridRowEnd = parseInt(
        computerStyle.getPropertyValue("grid-row-end").trim(),
        10
      );
      if (gridRowStart <= 1 || gridRowEnd < -1) return;
      const newGridTemplateRow =
        gridItemRef.current.offsetHeight -
        (itemsTotalHeight > height ? itemsTotalHeight - height : delta);
      const startIndex = gridRowStart - 1;
      const distributedHeight =
        newGridTemplateRow /
        (gridRowEnd === -1
          ? gridTemplateRows.slice(startIndex)
          : gridTemplateRows.slice(startIndex, gridRowEnd - 1)
        ).length;
      [...gridTemplateRows].forEach((_, index) => {
        if (
          index >= startIndex &&
          (gridRowEnd === -1 || index < gridRowEnd - 1)
        ) {
          updatePanelGridRowByIndex(index, `${distributedHeight}px`);
        } else if (index === startIndex - 1) {
          updatePanelGridRowByIndex(index, "1fr");
        }
      });
    }
  };

  function handleStart(e) {
    e.preventDefault();
    if (!gridRef?.current) return;
    gridRef.current?.classList?.add(
      orientation === "horizontal" ? "cursor-ew-resize" : "cursor-ns-resize"
    );
    beforeResize();

    startPosRef.current =
      orientation === "horizontal"
        ? e.type.includes("mouse")
          ? e.pageX
          : e.touches[0].pageX
        : e.type.includes("mouse")
        ? e.pageY
        : e.touches[0].pageY;

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleEnd);
    document.addEventListener("touchmove", handleMove);
    document.addEventListener("touchend", handleEnd);
  }

  function handleMove(e) {
    const currentPos =
      orientation === "horizontal"
        ? e.type.includes("mouse")
          ? e.pageX
          : e.touches[0].pageX
        : e.type.includes("mouse")
        ? e.pageY
        : e.touches[0].pageY;

    const delta = currentPos - startPosRef.current;
    startPosRef.current = currentPos;
    onResize(delta);
  }

  function handleEnd() {
    gridRef?.current?.classList?.remove(
      orientation === "horizontal" ? "cursor-ew-resize" : "cursor-ns-resize"
    );
    document.removeEventListener("mousemove", handleMove);
    document.removeEventListener("mouseup", handleEnd);
    document.removeEventListener("touchmove", handleMove);
    document.removeEventListener("touchend", handleEnd);
  }

  const orientationClass =
    orientation === "horizontal"
      ? "cursor-ew-resize h-full w-0.5 top-0 left-0 "
      : "cursor-ns-resize w-full h-0.5 top-0 right-0";
  return (
    <div
      draggable={false}
      onContextMenu={(e) => e.preventDefault()}
      onMouseDown={handleStart}
      onTouchStart={handleStart}
      className={clsx(
        "absolute select-none touch-none z-10",
        "dark:bg-gray-50 bg-gray-800",
        orientationClass
      )}
    />
  );
}

export default PanelResizer;
