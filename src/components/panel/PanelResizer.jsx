import React, { useRef } from "react";
import clsx from "clsx";
import { useLayoutStore } from "../stores/panel.store";

function PanelResizer({
  orientation = "horizontal",
  panelName,
  gridRef,
  gridItemRef,
}) {
  const startPosRef = useRef(0);

  const { gridTemplateAreas } = useLayoutStore();
  const { updatePanelGridColumnByIndex, updatePanelGridRowByIndex } =
    useLayoutStore();
  const { updateGridTemplateColumns, updateGridTemplateRows } =
    useLayoutStore();

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
    const index = Array.isArray(gridTemplateAreas)
      ? gridTemplateAreas.indexOf(panelName)
      : -1;
    if (index === -1 || !gridRef?.current || !gridItemRef.current) return;
    const { width, height } = gridRef.current.getBoundingClientRect();
    if (orientation === "horizontal") {
      const itemsTotalWidth = Array.from(
        gridRef.current.querySelectorAll(".panel-grid-item")
      ).reduce((acc, item) => acc + item.offsetWidth, 0);
      if (itemsTotalWidth <= 0) return;
      const newGridTemplateColumn =
        gridItemRef.current.offsetWidth -
        (itemsTotalWidth > width ? (itemsTotalWidth - width) : delta);
      updatePanelGridColumnByIndex(index, `${newGridTemplateColumn}px`);
      if (gridItemRef.current.previousElementSibling) {
        updatePanelGridColumnByIndex(index - 1, "1fr");
      }
    } else {
      const itemsTotalHeight = Array.from(
        gridRef.current.querySelectorAll(".panel-grid-item")
      ).reduce((acc, item) => acc + item.offsetHeight, 0);
      if (itemsTotalHeight <= 0) return;
      const newGridTemplateRow =
        gridItemRef.current.offsetHeight -
        (itemsTotalHeight > height ? (itemsTotalHeight - height) : delta);
      updatePanelGridRowByIndex(index, `${newGridTemplateRow}px`);
      if (gridItemRef.current.previousElementSibling) {
        updatePanelGridRowByIndex(index - 1, "1fr");
      }
    }
  };

  function handleStart(e) {
    e.preventDefault();

    gridRef?.current?.classList?.add(
      orientation === "horizontal" ? "cursor-ew-resize" : "cursor-ns-resize"
    );

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
    beforeResize();
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
