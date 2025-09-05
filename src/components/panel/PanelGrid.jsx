import React, { useEffect, useRef } from "react";
import { Outlet, useNavigate, useMatch } from "react-router";
import { usePanelStore, useLayoutStore } from "../stores/panel.store";
import PanelGridItem from "./PanelGridItem";

export default function PanelGrid() {
  const gridRef = useRef(null);
  const navigate = useNavigate();

  const { panels, isPanelVisible } = usePanelStore();
  const { gridItems, gridTemplateColumns, gridTemplateAreas } =
    useLayoutStore();
  const { updateGridTemplateColumns } = useLayoutStore();

  const gridItemContents = {
    explorer: "All Tabs",
    workspace: "Workspace",
    pdf: "PDF Preview",
  };

  const isWorkspaceRoot = useMatch("/workspace");
  const noTabsAnywhere = panels.every((p) => !isPanelVisible(p.id));

  useEffect(() => {
    if (noTabsAnywhere && isWorkspaceRoot) {
      navigate("/welcome", { replace: true });
    }
  }, [noTabsAnywhere, isWorkspaceRoot, navigate]);

  const beforeResize = () => {
    // run updateGridTemplateColumn for all the children grid item with their offsetWidth
    if (!gridRef.current) return;
    const children = Array.from(
      gridRef.current.querySelectorAll(".panel-grid-item")
    );
    
    const newGridTemplateColumns = children.map((child) => {
      const width = child.offsetWidth;
      return `${width}px`;
    });
    updateGridTemplateColumns(newGridTemplateColumns);
  };

  const visiblePanels = panels.filter((p) => p?.tabStack?.size > 0);
  if (visiblePanels.length === 0) {
    return <Outlet />;
  }

  return (
    <div
      ref={gridRef}
      className="h-full w-full grid panel-grid"
      style={{
        gridTemplateColumns: Array.isArray(gridTemplateColumns)
          ? gridTemplateColumns.join(" ")
          : "1fr 3fr 2fr",
        gridTemplateAreas: Array.isArray(gridTemplateAreas)
          ? `"${gridTemplateAreas.join(" ")}"`
          : '"explorer workspace pdf"',
      }}
    >
      {gridItems.filter((item) => gridTemplateAreas.includes(item.name))
        .map((item, index) => (
          <PanelGridItem
            key={index}
            index={index}
            resizable={index > 0 && (item.horizontallyResizable || item.verticallyResizable)}
            horizontallyResizable={item.horizontallyResizable}
            verticallyResizable={item.verticallyResizable}
            panelId={item.panelId}
            panelName={item.name}
            gridRef={gridRef}
            beforeResize={beforeResize}
          >
            {gridItemContents[item.name]}
          </PanelGridItem>
        ))}
    </div>
  );
}
