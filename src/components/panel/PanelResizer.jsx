import React, { useRef, useEffect } from "react";
import clsx from "clsx";
import { useGridLayoutStore } from "../stores/panel.store";

function PanelResizer({ orientation = "horizontal", gridRef, gridItemRef }) {
  const startPosRef = useRef(0);
  const { gridTemplateColumns, gridTemplateRows } = useGridLayoutStore();
  const gridTemplateColumnsRef = useRef(gridTemplateColumns);
  const gridTemplateRowsRef = useRef(gridTemplateRows);

  useEffect(() => {
    gridTemplateColumnsRef.current = gridTemplateColumns;
  }, [gridTemplateColumns]);

  useEffect(() => {
    gridTemplateRowsRef.current = gridTemplateRows;
  }, [gridTemplateRows]);

  const { updatePanelGridColumnByIndex, updatePanelGridRowByIndex } =
    useGridLayoutStore();
  const { updateGridTemplateColumns, updateGridTemplateRows } =
    useGridLayoutStore();
  const { trimZeroPxTemplateColumns, trimZeroPxTemplateRows } =
    useGridLayoutStore();

  if (orientation !== "horizontal" && orientation !== "vertical") {
    return null;
  }

  const getNextGridItemStartAndEnd = (currentStart, expectedStart) => {
    if (currentStart < 1 || expectedStart < currentStart) {
      return {};
    }
    const gridItems = Array.from(
      gridRef.current.querySelectorAll(".panel-grid-item")
    );
    let isNextOne = false;
    for (const gridItem of gridItems) {
      const computedStyle = window.getComputedStyle(gridItem);
      const start = parseInt(
        orientation === "horizontal"
          ? computedStyle.gridColumnStart
          : computedStyle.gridRowStart,
        10
      );
      const end = parseInt(
        orientation === "horizontal"
          ? computedStyle.gridColumnEnd
          : computedStyle.gridRowEnd,
        10
      );
      if (start === currentStart) {
        isNextOne = true;
      } else if (isNextOne) {
        if (start === expectedStart) {
          return { start, end, width: gridItem.offsetWidth };
        }
        break;
      }
    }
    return {};
  };

  const getExpandedGridTemplate = (explicitTemplate) => {
    const explicit = explicitTemplate;
    const explicitCount = explicit.length;

    let maxStart = explicitCount;

    gridRef.current.querySelectorAll(".panel-grid-item").forEach((item) => {
      const style = window.getComputedStyle(item);

      let start = parseInt(
        orientation === "horizontal"
          ? style.gridColumnStart.trim()
          : style.gridRowStart.trim(),
        10
      );

      if (isNaN(start)) {
        return;
      }

      maxStart = Math.max(maxStart, start);
    });

    if (maxStart > explicitCount) {
      const extra = Array(maxStart - explicitCount).fill("0px");
      return [...explicit, ...extra];
    }

    return explicit;
  };

  const beforeResize = () => {
    if (!gridRef.current) return;
    const children = Array.from(
      gridRef.current.querySelectorAll(".panel-grid-item")
    );

    if (orientation === "horizontal") {
      const newGridTemplateColumns = children
        .map((child) => {
          const computedStyle = window.getComputedStyle(child);
          const columnCount = gridTemplateColumnsRef.current.length;
          const gridColumnStart = parseInt(
            computedStyle.getPropertyValue("grid-column-start").trim(),
            10
          );
          const gridColumnEnd = parseInt(
            computedStyle.getPropertyValue("grid-column-end").trim(),
            10
          );
          if (
            columnCount === 0 ||
            Number.isNaN(gridColumnStart) ||
            gridColumnStart < 1 ||
            Number.isNaN(gridColumnEnd) ||
            gridColumnEnd === 0 ||
            gridColumnEnd < -1
          ) {
            return;
          }
          const cellCount =
            gridColumnEnd === -1
              ? columnCount + 1 - gridColumnStart
              : gridColumnEnd - gridColumnStart;

          const width = child.offsetWidth;
          return new Array(cellCount).fill(`${width / cellCount}px`);
        })
        .flat();
      updateGridTemplateColumns(
        getExpandedGridTemplate(newGridTemplateColumns)
      );
    } else {
      const newGridTemplateRows = children
        .map((child) => {
          const computedStyle = window.getComputedStyle(child);
          const rowCount = gridTemplateRows.length;
          const gridRowStart = parseInt(
            computedStyle.getPropertyValue("grid-row-start").trim(),
            10
          );
          const gridRowEnd = parseInt(
            computedStyle.getPropertyValue("grid-row-end").trim(),
            10
          );
          if (
            rowCount === 0 ||
            Number.isNaN(gridRowStart) ||
            gridRowStart < 1 ||
            Number.isNaN(gridRowEnd) ||
            gridRowEnd === 0 ||
            gridRowEnd < -1
          ) {
            return;
          }
          const cellCount =
            gridRowEnd === -1
              ? rowCount + 1 - gridRowStart
              : gridRowEnd - gridRowStart;
          const height = child.offsetHeight;
          return new Array(cellCount).fill(`${height / cellCount}px`);
        })
        .flat();
      updateGridTemplateRows(getExpandedGridTemplate(newGridTemplateRows));
    }
  };

  const onResize = (delta) => {
    if (!gridRef?.current || !gridItemRef.current) return;
    const { width, height } = gridRef.current.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(gridItemRef.current);
    const children = gridRef.current.querySelectorAll(".panel-grid-item");
    if (orientation === "horizontal") {
      const itemsTotalWidth = Array.from(children).reduce(
        (acc, item) => acc + item.offsetWidth,
        0
      );
      if (
        (itemsTotalWidth <= 0 && delta <= 0) ||
        (itemsTotalWidth > width && delta >= 0)
      ) {
        return;
      }
      const gridColumnStart = parseInt(
        computedStyle.getPropertyValue("grid-column-start").trim(),
        10
      );
      const gridColumnEnd = parseInt(
        computedStyle.getPropertyValue("grid-column-end").trim(),
        10
      );
      if (gridColumnStart < 1 || gridColumnEnd <= 0) return;
      const {
        start: nextGridColumnStart,
        end: nextGridColumnEnd,
        width: nextGridColumnWidth,
      } = getNextGridItemStartAndEnd(gridColumnStart, gridColumnEnd);
      if (!nextGridColumnStart) {
        return;
      }
      console.log(`Condition -> ${itemsTotalWidth > width}`);
      const newGridTemplateColumn = gridItemRef.current.offsetWidth + delta;
      const startIndex = gridColumnStart - 1;
      const endIndex = gridColumnEnd - 1;
      const selfDistributedWidth =
        newGridTemplateColumn /
        gridTemplateColumnsRef.current.slice(startIndex, endIndex).length;

      const nextGridTemplateColumm = nextGridColumnWidth - delta;
      const nextStartIndex = nextGridColumnStart - 1;
      const nextDistributedWidth =
        nextGridTemplateColumm /
        (nextGridColumnEnd === -1
          ? gridTemplateColumnsRef.current.slice(nextStartIndex + 1)
          : gridTemplateColumnsRef.current.slice(
              nextStartIndex + 1,
              nextGridColumnEnd - 1
            )
        ).length;
      [...gridTemplateColumnsRef.current].forEach((_, index) => {
        if (index >= startIndex && index < endIndex) {
          updatePanelGridColumnByIndex(index, `${selfDistributedWidth}px`);
        } else if (index === nextStartIndex) {
          updatePanelGridColumnByIndex(index, "1fr");
        } else if (
          index > nextStartIndex &&
          Number.isFinite(nextDistributedWidth) &&
          (nextGridColumnEnd === -1 || index < nextGridColumnEnd - 1)
        ) {
          updatePanelGridColumnByIndex(index, `${nextDistributedWidth}px`);
        }
      });
    } else {
      const itemsTotalHeight = Array.from(children).reduce(
        (acc, item) => acc + item.offsetHeight,
        0
      );

      // Prevent shrinking below 0 or growing beyond container
      if (
        (itemsTotalHeight <= 0 && delta <= 0) ||
        (itemsTotalHeight > height && delta >= 0)
      ) {
        return;
      }
      const gridRowStart = parseInt(
        computedStyle.getPropertyValue("grid-row-start").trim(),
        10
      );
      const gridRowEnd = parseInt(
        computedStyle.getPropertyValue("grid-row-end").trim(),
        10
      );
      if (gridRowStart < 1 || gridRowEnd <= 0) return;

      const {
        start: nextGridRowStart,
        end: nextGridRowEnd,
        width: nextGridRowHeight, // width -> height in vertical mode
      } = getNextGridItemStartAndEnd(gridRowStart, gridRowEnd);
      if (!nextGridRowStart) {
        return;
      }

      const newGridTemplateRow = gridItemRef.current.offsetHeight + delta;
      const startIndex = gridRowStart - 1;
      const endIndex = gridRowEnd - 1;
      const selfDistributedHeight =
        newGridTemplateRow /
        gridTemplateRowsRef.current.slice(startIndex, endIndex).length;

      const nextGridTemplateRow = nextGridRowHeight - delta;
      const nextStartIndex = nextGridRowStart - 1;
      const nextDistributedHeight =
        nextGridTemplateRow /
        (nextGridRowEnd === -1
          ? gridTemplateRowsRef.current.slice(nextStartIndex + 1)
          : gridTemplateRowsRef.current.slice(
              nextStartIndex + 1,
              nextGridRowEnd - 1
            )
        ).length;

      [...gridTemplateRowsRef.current].forEach((_, index) => {
        if (index >= startIndex && index < endIndex) {
          updatePanelGridRowByIndex(index, `${selfDistributedHeight}px`);
        } else if (index === nextStartIndex) {
          updatePanelGridRowByIndex(index, "1fr");
        } else if (
          index > nextStartIndex &&
          Number.isFinite(nextDistributedHeight) &&
          (nextGridRowEnd === -1 || index < nextGridRowEnd - 1)
        ) {
          updatePanelGridRowByIndex(index, `${nextDistributedHeight}px`);
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
    if (orientation === "horizontal") {
      gridRef?.current?.classList?.remove("cursor-ew-resize");
      trimZeroPxTemplateColumns();
    } else {
      gridRef?.current?.classList?.remove("cursor-ns-resize");
      trimZeroPxTemplateRows();
    }
    document.removeEventListener("mousemove", handleMove);
    document.removeEventListener("mouseup", handleEnd);
    document.removeEventListener("touchmove", handleMove);
    document.removeEventListener("touchend", handleEnd);
  }

  const orientationClass =
    orientation === "horizontal"
      ? "cursor-ew-resize h-full w-0.5 top-0 right-0 "
      : "cursor-ns-resize w-full h-0.5 bottom-0 right-0";
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
