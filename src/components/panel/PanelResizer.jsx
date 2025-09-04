import React, { useRef } from "react";
import clsx from "clsx";

function PanelResizer({ orientation = "horizontal", onResize }) {
  const startPosRef = useRef(0);

  function handleStart(e) {
    e.preventDefault();

    startPosRef.current = orientation === "horizontal"
      ? (e.type.includes("mouse") ? e.pageX : e.touches[0].pageX)
      : (e.type.includes("mouse") ? e.pageY : e.touches[0].pageY);


    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleEnd);
    document.addEventListener("touchmove", handleMove);
    document.addEventListener("touchend", handleEnd);
  }

  function handleMove(e) {
    const currentPos = orientation === "horizontal"
      ? (e.type.includes("mouse") ? e.pageX : e.touches[0].pageX)
      : (e.type.includes("mouse") ? e.pageY : e.touches[0].pageY);

    const delta = currentPos - startPosRef.current;

    if (onResize) {
      onResize(delta);
    }
  }

  function handleEnd() {
    document.removeEventListener("mousemove", handleMove);
    document.removeEventListener("mouseup", handleEnd);
    document.removeEventListener("touchmove", handleMove);
    document.removeEventListener("touchend", handleEnd);
  }

  const orientationClass =
    orientation === "horizontal"
      ? "horizontal-resize-handle cursor-ew-resize h-full w-0.5 right-0 top-0"
      : "vertical-resize-handle cursor-ns-resize w-full h-0.5 bottom-0 left-0";

  return (
    <div
      draggable={false}
      onContextMenu={(e) => e.preventDefault()}
      onMouseDown={handleStart}
      onTouchStart={handleStart}
      className={clsx(
        "absolute select-none touch-none resize-handle z-10",
        "dark:bg-gray-50 bg-gray-800",
        orientationClass
      )}
    />
  );
}

export default PanelResizer;
