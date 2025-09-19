import React, { useEffect, useRef } from "react";
import { Outlet, useNavigate, useMatch } from "react-router";
import { usePanelStore, useGridLayoutStore } from "../stores/panel.store";
import PanelGridItem from "./PanelGridItem";

export default function PanelGrid() {
  const gridRef = useRef(null);
  const navigate = useNavigate();

  const { panels, isPanelVisible } = usePanelStore();
  const { gridTemplateColumns, gridTemplateRows } = useGridLayoutStore();
  const { getGridLayout } = useGridLayoutStore();

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


  const gridLayout = getGridLayout();

  return (
    <div
      ref={gridRef}
      className="h-full w-full grid panel-grid auto-cols-[0] auto-rows-[0] overflow-hidden"
      style={{
        gridTemplateColumns: gridTemplateColumns.join(" "),
        gridTemplateRows: gridTemplateRows.join(" "),
      }}
    >
      {gridLayout.map((item, index) => (
          <PanelGridItem
            key={index}
            gridRef={gridRef}
            resizable={item.supportResizability && (item.horizontallyResizable || item.verticallyResizable)}
            horizontallyResizable={item.horizontallyResizable}
            verticallyResizable={item.verticallyResizable}
            className={item.className}
            panelName={item.name}
            gridRow={{
              start: item.rowLineStart,
              end: item.rowLineEnd
            }}
            gridColumn={{
              start: item.columnLineStart,
              end: item.columnLineEnd
            }}
          >
            {gridItemContents[item.name]}
          </PanelGridItem>
        ))}
    </div>
  );
}
