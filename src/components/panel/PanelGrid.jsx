import React, { useEffect, useRef } from "react";
import { Outlet, useNavigate, useMatch } from "react-router";
import { usePanelStore, useLayoutStore } from "../stores/panel.store";
import PanelGridItem from "./PanelGridItem";

export default function PanelGrid() {
  const gridRef = useRef(null);
  const navigate = useNavigate();

  const { panels, isPanelVisible } = usePanelStore();
  const { gridItems, gridTemplateRows, gridTemplateColumns, gridTemplateMatrix } =
    useLayoutStore();

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

  const visiblePanels = panels.filter((p) => p?.tabStack?.size > 0);
  if (visiblePanels.length === 0) {
    return <Outlet />;
  }

  const gridCellCount = gridTemplateColumns.length * gridTemplateRows.length;


  return (
    <div
      ref={gridRef}
      className="h-full w-full grid panel-grid"
      style={{
        gridTemplateColumns: gridTemplateColumns.join(" "),
        gridTemplateRows: gridTemplateRows.join(" "),
        gridTemplateAreas: gridTemplateMatrix.map(
          gridTemplateAreas => `"${gridTemplateAreas.join(" ")}"`).join("\n")
      }}
    >
      {gridItems.filter((item) => gridTemplateMatrix.flat().includes(item.name))
        .map((item, index) => (
          <PanelGridItem
            key={index}
            resizable={index > 0 && (item.horizontallyResizable || item.verticallyResizable)}
            horizontallyResizable={item.horizontallyResizable}
            verticallyResizable={item.verticallyResizable}
            panelId={item.panelId}
            panelName={item.name}
            gridRef={gridRef}
          >
            {gridItemContents[item.name]}
          </PanelGridItem>
        ))}
    </div>
  );
}
