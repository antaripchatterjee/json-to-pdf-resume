import { create } from "zustand";
import AutoIncrementalTabIndex from "./utils/autoIncrementalTabIndex";

const useTabStore = create((set, get) => ({
  tabs: new Map(),
  activeTabIndex: null,
  addTab: () => {
    set((state) => {
      const tabIndex = AutoIncrementalTabIndex.getNext();
      const newTabs = new Map(state.tabs);
      newTabs.set(tabIndex, `New Tab ${tabIndex}`);
      return {
        tabs: newTabs,
        activeTabIndex: tabIndex
      };
    });
    return get().activeTabIndex;
  },
  removeTab: (tabIndex) => {
    const navigatePrevious = tabIndex === get().activeTabIndex;
    set((state) => {
      const newTabs = new Map(state.tabs);
      newTabs.delete(tabIndex);
      return {
        tabs: newTabs
      }
    });
    return navigatePrevious;
  },
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