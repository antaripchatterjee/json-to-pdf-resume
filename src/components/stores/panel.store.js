import { create } from "zustand";
import AutoIncrementalTabIndex from "./utils/autoIncrementalTabIndex";
import AutoIncrementalPanelIndex from "./utils/autoIncrementalPanelIndex";

export const RESERVED_ALL_TABS_PANEL = AutoIncrementalPanelIndex.getNext();
export const RESERVED_WORKSPACE_PANEL = AutoIncrementalPanelIndex.getNext();
export const RESERVED_PDF_PREVIEW_PANEL = AutoIncrementalPanelIndex.getNext();

const RESERVED_EDITOR_PANEL_START = AutoIncrementalPanelIndex.reset(1024);

export const usePanelStore = create((set, get) => ({
  panels: [
    {
      id: RESERVED_EDITOR_PANEL_START,
      tabs: new Map(),
      tabStack: new Set(),
    },
  ],
  activePanelId: RESERVED_EDITOR_PANEL_START,

  addPanel: () => {
    const newPanelId = AutoIncrementalPanelIndex.getNext();
    set((state) => ({
      panels: [
        ...structuredClone(state.panels),
        { id: newPanelId, tabs: new Map(), tabStack: new Set() },
      ],
      activePanelId: newPanelId,
    }));
    return newPanelId;
  },

  addTab: (panelId, monaco, langId, tabIndex) => {
    if (!monaco) return null;

    const newTabIndex = Number.isInteger(tabIndex)
      ? AutoIncrementalTabIndex.reset(tabIndex)
      : AutoIncrementalTabIndex.getNext();

    const path = `workspace/tabs/${newTabIndex}.${langId}`;
    const uri = monaco.Uri.parse(`file:///${path}`);

    let model = monaco.editor.getModel(uri);
    if (!model) {
      model = monaco.editor.createModel("", langId, uri);
    }
    if (!model) return null;

    set((state) => {
      const panels = state.panels.map((p) => {
        if (p.id === panelId) {
          const newTabs = new Map(p.tabs);
          newTabs.set(newTabIndex, {
            id: newTabIndex,
            title: `New Tab ${newTabIndex}`,
            path,
          });
          const newStack = new Set(p.tabStack);
          newStack.add(newTabIndex);
          return { ...p, tabs: newTabs, tabStack: newStack };
        }
        return p;
      });
      return { panels };
    });

    return newTabIndex;
  },

  removeTab: (panelId, tabIndex) => {
    const activeTabIndex =
      panelId !== null ? get().getActiveTab(panelId) : null;

    set((state) => {
      const panels = state.panels.map((p) => {
        if (panelId === null || p.id === panelId) {
          const newTabs = new Map(p.tabs);
          newTabs.delete(tabIndex);
          const newStack = new Set(p.tabStack);
          newStack.delete(tabIndex);
          return { ...p, tabs: newTabs, tabStack: newStack };
        }
        return p;
      });
      return { panels };
    });

    if (panelId !== null) {
      const panel = get().panels.find((p) => p.id === panelId);
      const stackArr = panel ? [...panel.tabStack] : [];
      return {
        navigateTo: stackArr[stackArr.length - 1] ?? null,
        shouldNavigate: activeTabIndex === tabIndex,
      };
    }
    return { navigateTo: null, shouldNavigate: false };
  },

  setActiveTab: (panelId, tabIndex, mode = 0) => {
    set((state) => {
      let panels = [...state.panels];

      const foundInPanel =
        panels.findLast((panel) => panel.tabs.has(tabIndex))?.id ?? -1;

      if (foundInPanel !== panelId) {
        // copy/move logic
        const sourcePanel = panels.find((p) => p.id === foundInPanel);
        const tabData = sourcePanel.tabs.get(tabIndex);

        if (mode === 0) {
          // move
          const newTabs = new Map(sourcePanel.tabs);
          newTabs.delete(tabIndex);
          const newStack = new Set(sourcePanel.tabStack);
          newStack.delete(tabIndex);
          panels = panels.map((p) =>
            p.id === foundInPanel
              ? { ...p, tabs: newTabs, tabStack: newStack }
              : p
          );
        }

        if (tabData) {
          const targetPanel = panels.find((p) => p.id === panelId);
          const newTabs = new Map(targetPanel.tabs);
          newTabs.set(tabIndex, { ...tabData });
          const newStack = new Set(targetPanel.tabStack);
          newStack.delete(tabIndex);
          newStack.add(tabIndex);
          panels = panels.map((p) =>
            p.id === panelId ? { ...p, tabs: newTabs, tabStack: newStack } : p
          );
        }
      } else {
        // already in this panel
        panels = panels.map((p) => {
          if (p.id === panelId) {
            const newStack = new Set(p.tabStack);
            newStack.delete(tabIndex);
            newStack.add(tabIndex);
            return { ...p, tabStack: newStack };
          }
          return p;
        });
      }

      return { panels };
    });
  },

  getActiveTab: (panelId) => {
    const panel = get().panels.find((p) => p.id === panelId);
    if (!panel) return null;
    const arr = [...panel.tabStack];
    return arr[arr.length - 1] ?? null;
  },

  updateTabTitle: (tabIndex, newTitle) => {
    set((state) => {
      const panels = state.panels.map((p) => {
        if (p.tabs.has(tabIndex)) {
          const newTabs = new Map(p.tabs);
          const tab = newTabs.get(tabIndex);
          newTabs.set(tabIndex, { ...tab, title: newTitle });
          return { ...p, tabs: newTabs };
        }
        return p;
      });
      return { panels };
    });
  },

  updateTabPath: (tabIndex, newPath) => {
    set((state) => {
      const panels = state.panels.map((p) => {
        if (p.tabs.has(tabIndex)) {
          const newTabs = new Map(p.tabs);
          const tab = newTabs.get(tabIndex);
          newTabs.set(tabIndex, { ...tab, path: newPath });
          return { ...p, tabs: newTabs };
        }
        return p;
      });
      return { panels };
    });
  },

  setActivePanel: (panelId) => {
    set({ activePanelId: panelId });
  },
  getActivePanelId: () => {
    return get().activePanelId;
  },
  getFirstPanelId: () => {
    return get().panels.length > 0 ? get().panels[0].id : null;
  },
  isPanelVisible: (panelId) => {
    return get().panels.some((p) => p?.id === panelId && p?.tabStack?.size > 0);
  },
}));

const findNextHigher = (arr, key, value) => {
  const higher = arr
    .map(obj => obj[key])
    .filter(v => v > value);

  if (higher.length === 0) return -1;
  return Math.min(...higher);
}

export const useGridLayoutStore = create((set, get) => ({
  gridTemplateColumns: ["1fr", "3fr", "2fr"],
  gridTemplateRows: ["1fr"],
  // gridTemplateMatrix: [["explorer", "workspace", "pdf"]],
  gridItems: [
    {
      panelId: RESERVED_ALL_TABS_PANEL,
      name: "explorer",
      visible: true,
      row: 1,
      column: 1,
      horizontallyResizable: false,
      verticallyResizable: false,
    },
    {
      panelId: RESERVED_WORKSPACE_PANEL,
      name: "workspace",
      visible: true,
      row: 1,
      column: 2,
      horizontallyResizable: true,
      verticallyResizable: false,
    },
    {
      panelId: RESERVED_PDF_PREVIEW_PANEL,
      name: "pdf",
      visible: true,
      row: 1,
      column: 3,
      horizontallyResizable: true,
      verticallyResizable: false,
    },
  ],

  getGridLayout: () => {
    const cols = get().gridTemplateColumns;
    const rows = get().gridTemplateRows;
    const gridItems = get().gridItems.filter(item =>
      item.row <= rows.length && item.column <= cols.length && (item.visible ?? true)
    );
    const gridLayout = gridItems.map(item => ({
      ...item,
      columnLineStart: item.column,
      columnLineEnd: findNextHigher(gridItems, 'column', item.column),
      rowLineStart: item.row,
      rowLineEnd: findNextHigher(gridItems, 'row', item.row),
      supportResizability: !!(window.getComputedStyle),
      horizontallyResizable: item.horizontallyResizable && item.column > 1,
      verticallyResizable: item.verticallyResizable && item.row > 1,
    }));
    return { gridLayout };
  },
  updatePanelGridColumnByIndex: (index, gridTemplateColumn) => {
    set((state) => {
      const newGridTemplateColumns = Array.isArray(state.gridTemplateColumns)
        ? [...state.gridTemplateColumns]
        : [];
      newGridTemplateColumns[index] = gridTemplateColumn;
      return { gridTemplateColumns: newGridTemplateColumns };
    });
  },
  updateGridTemplateColumns: (newGridTemplateColumns) =>
    set({
      gridTemplateColumns: [...newGridTemplateColumns],
    }),
  updatePanelGridRowByIndex: (index, gridTemplateRow) => {
    set((state) => {
      const newGridTemplateRows = Array.isArray(state.gridTemplateRows)
        ? [...state.gridTemplateRows]
        : [];
      newGridTemplateRows[index] = gridTemplateRow;
      return { gridTemplateRows: newGridTemplateRows };
    });
  },
  updateGridTemplateRows: (newGridTemplateRows) =>
    set({
      gridTemplateRows: [...newGridTemplateRows],
    }),
}));
