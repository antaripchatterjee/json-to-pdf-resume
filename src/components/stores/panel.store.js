import { create } from "zustand";
import AutoIncrementalTabIndex from "./utils/autoIncrementalTabIndex";

const MAX_PANELS = 4;

const usePanelStore = create((set, get) => ({
  panels: Array.from({ length: MAX_PANELS }, (_, i) => ({
    id: i + 1,
    tabs: new Map(),
    tabStack: new Set(),
  })),

  activePanelId: 1,

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
    if(panelId < 1 || panelId > 4) return null;
    set((state) => {
      let panels = [...state.panels];

      const foundInPanel = panels.findLast(panel => panel.tabs.has(tabIndex))?.id ?? -1;

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
            p.id === foundInPanel ? { ...p, tabs: newTabs, tabStack: newStack } : p
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
    if(panelId < 1 || panelId > 4) return null;
    set({ activePanelId: panelId });
    return panelId;
  },
  getActivePanel: () => get().activePanelId,
  isPanelVisible: (panelId) =>  (panelId < 1 || panelId > 4) && 
    get().panels.find(({id}) => id ===panelId)?.tabStack?.size > 0
}));

export default usePanelStore;
