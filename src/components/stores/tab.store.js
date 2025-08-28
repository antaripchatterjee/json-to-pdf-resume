import { create } from "zustand";
import AutoIncrementalTabIndex from "./utils/autoIncrementalTabIndex";

const useTabStore = create((set, get) => ({
  tabs: new Map(),
  tabStack: new Set(),
  addTab: (tabIndex) => {
    if(get().tabs.get(tabIndex)) return null;
    const newTabIndex = Number.isInteger(tabIndex) 
      ? AutoIncrementalTabIndex.reset(tabIndex) 
      : AutoIncrementalTabIndex.getNext();
    set((state) => {
      const newTabs = new Map(state.tabs);
      newTabs.set(newTabIndex, {
        title: `New Tab ${newTabIndex}`
      });
      const newTabStack = new Set(state.tabStack).add(newTabIndex);
      return {
        tabs: newTabs,
        tabStack: newTabStack
      };
    });
    return newTabIndex;
  },
  removeTab: (tabIndex) => {
    const activeTabIndex = get().getActiveTab();
    set((state) => {
      const newTabs = new Map(state.tabs);
      newTabs.delete(tabIndex);
      const newTabStack = new Set(state.tabStack);
      newTabStack.delete(tabIndex);
      return {
        tabs: newTabs,
        tabStack: newTabStack
      }
    });
    const tabStackAsArray = [...get().tabStack];
    return {
      navigateTo: tabStackAsArray[tabStackAsArray.length - 1] ?? null,
      shouldNavigate: activeTabIndex === tabIndex
    };
  },
  updateTabTitle: (tabIndex, newTitle) => {
    if(!get().tabs.has(tabIndex)) return;
    set((state) => {
      const newTabs = new Map(state.tabs);
      newTabs.set(tabIndex, {
        ...(newTabs.get(tabIndex)),
        title: newTitle
      });
      return { tabs: newTabs };
    });
  },
  updateTabPath: (tabIndex, newPath) => {
    if(!get().tabs.has(tabIndex)) return;
    set((state) => {
      const newTabs = new Map(state.tabs);
      newTabs.set(tabIndex, {
        ...(newTabs.get(tabIndex)),
        path: newPath
      });
      return { tabs: newTabs };
    });
  },
  setActiveTab: (tabIndex) => set(state => {
    const newTabStack = new Set(state.tabStack);
    newTabStack.delete(tabIndex);
    newTabStack.add(tabIndex);
    return {
      tabStack: newTabStack
    }
  }),
  getActiveTab: () => {
    const tabStackAsArray = [...get().tabStack];
    return tabStackAsArray[tabStackAsArray.length - 1] ?? null;
  },
  getTabTitle: (tabIndex) => {
    const {title} = get().tabs.get(tabIndex) ?? {title: null};
    return title;
  },
  getTabPath: (tabIndex) => {
    const {path} = get().tabs.get(tabIndex) ?? {path: null};
    return path;
  },
  ensureTab: (tabIndex, monaco, langId) => {
    const path = `workspace/tabs/${tabIndex}.${langId}`;
    const uri = monaco.Uri.parse(`file:///${path}`)
    let model = monaco.editor.getModel(uri);
    if (!get().tabs.has(tabIndex)) {
      if(get().addTab(tabIndex)) {
        if(!model) {
          model = monaco.editor.createModel(
            "", langId, uri
          );
          if(model) {
            get().updateTabPath(tabIndex, path);
          }
        }
        return model;
      }
      return null;
    }
    return model;
  }
}));

export default useTabStore;