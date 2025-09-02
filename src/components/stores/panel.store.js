import { create } from "zustand";
import AutoIncrementalTabIndex from "./utils/autoIncrementalTabIndex";
import AutoIncrementalPanelIndex from "./utils/autoIncrementalPanelIndex";

const RESERVED_EXPLORER_PANEL_ID_LEFT = AutoIncrementalPanelIndex.getNext();
const RESERVED_EXPLORER_PANEL_ID_RIGHT = AutoIncrementalPanelIndex.getNext();
const RESERVED_PDF_PREVIEWER_PANEL_ID_1 = AutoIncrementalPanelIndex.getNext();
const RESERVED_PDF_PREVIEWER_PANEL_ID_2 = AutoIncrementalPanelIndex.getNext();

const RESERVED_WORKSPACE_PANEL_ID_1 = AutoIncrementalPanelIndex.reset(1024);

function findPaths(arr, matcher, maxMatch = -1) {
  const results = [];

  function helper(subArr, path) {
    for (let i = 0; i < subArr.length; i++) {
      const item = subArr[i];
      const currentPath = [...path, i];

      if (matcher(item)) {
        results.push(currentPath);
        if (maxMatch > -1 && results.length >= maxMatch) {
          return true; // stop early
        }
      }

      if (Array.isArray(item)) {
        if (helper(item, currentPath)) {
          return true; // propagate stop
        }
      }
    }
    return false;
  }

  helper(arr, []);
  return results;
}

export const usePanelStore = create((set, get) => ({
  panels: [
    [
      {
        id: RESERVED_EXPLORER_PANEL_ID_LEFT,
        type: "utility",
        name: "All Tabs",
        classes: "explorer",
        visibility: false,
        siblingsAllowed: false,
        objects: null,
      },
    ],
    [
      [
        {
          id: AutoIncrementalPanelIndex.getNext(),
          type: "workspace",
          classes: (self) => `editor-panel editor-panel-${self.id}`,
          visibility: (self) => self.objects.tabStack.size > 0,
          siblingsAllowed: true,
          objects: {
            tabs: new Map(),
            tabStack: new Set(),
          },
        },
      ],
    ],
    [
      {
        id: RESERVED_EXPLORER_PANEL_ID_RIGHT,
        type: "utility",
        name: "All Tabs",
        classes: "explorer",
        visibility: false,
        siblingsAllowed: false,
        objects: null,
      },
    ],
  ],

  activePanelPath: [0],

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
    const paths = findPaths(get().panels, (panel) => panel.id === panelId, 1);
    if (paths.length === 0) {
      return console.warn(`Could not find panel with id ${panelId}`);
    }
    set({
      activePanelPath: [...paths[0]],
    });
  },
  getActivePanelPath: () => {
    return get().activePanelPath;
  },
  getPanelInfoByPath: (path) => {
    let panelInfo = get().panels;
    for (const path_index of path) {
      panelInfo = panelInfo[path_index] ?? null;
      if (!panelInfo) {
        break;
      }
    }
    return structuredClone(panelInfo);
  },
  isPanelVisible: (panelId) => {
    return (
      findPaths(
        get().panels,
        (panel) => panel?.id === panelId && panel?.tabStack?.size > 0,
        1
      ).length > 0
    );
  },
}));

// export const useLayoutStore = create((set, get) => ({
//   layout: [[]],

//   setLayout: (newLayout) => set({ layout: newLayout }),

//   addColumn: () => {
//     const layout = [...get().layout];
//     layout.push([]);
//     set({ layout });
//   },

//   removeColumn: (colIndex) => {
//     const layout = get().layout.filter((_, i) => i !== colIndex);
//     set({ layout });
//   },

//   addRow: (colIndex, panelId) => {
//     const layout = [...get().layout];
//     if (!layout[colIndex]) layout[colIndex] = [];
//     layout[colIndex] = [...layout[colIndex], panelId];
//     set({ layout });
//   },

//   removeRow: (colIndex, rowIndex) => {
//     const layout = [...get().layout];
//     if (layout[colIndex]) {
//       layout[colIndex] = layout[colIndex].filter((_, i) => i !== rowIndex);
//     }
//     set({ layout });
//   },

//   movePanel: (fromCol, fromRow, toCol, toRow) => {
//     const layout = [...get().layout].map((col) => [...col]);

//     const [panelId] = layout[fromCol].splice(fromRow, 1); // remove
//     layout[toCol].splice(toRow, 0, panelId); // insert

//     set({ layout });
//   },
// }));
