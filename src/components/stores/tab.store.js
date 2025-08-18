import { create } from "zustand";
import AutoIncrementalTabIndex from "./utils/autoIncrementalTabIndex";

const useTabStore = create((set) => ({
  tabs: new Map(),
  activeTabIndex: null,
  addTab: () => set((state) => {
    const tabIndex = AutoIncrementalTabIndex.getNext();
    const newTabs = new Map(state.tabs);
    newTabs.set(tabIndex, `New Tab ${tabIndex}`);
    return {
      tabs: newTabs,
      activeTabIndex: tabIndex
    };
  }),
  removeTab: (tabIndex) => set((state) => {
    let deleteOkay = true;
    const newTabs = new Map(state.tabs);
    let newActive = state.activeTabIndex;
    if (newActive === tabIndex) {
      const keys = Array.from(newTabs.keys());
      if (keys.length > 1) {
        const idx = keys.indexOf(tabIndex);
        if (idx > 0) {
          newActive = keys[idx - 1];
        } else if(idx === 0) {
          newActive = keys[1] ?? null;
        } else {
          deleteOkay = false;
        }
      } else {
        newActive = null;
      }
    }
    if(deleteOkay) {
      newTabs.delete(tabIndex);
    }
    return {
      tabs: newTabs,
      activeTabIndex: newActive
    };
  }),
  updateTab: (tabIndex, newLabel) => set((state) => {
    const newTabs = new Map(state.tabs);
    newTabs.set(tabIndex, newLabel);
    return { tabs: newTabs };
  }),
  setActiveTab: (tabIndex) => set({
    activeTabIndex: tabIndex
  })
}));

export default useTabStore;