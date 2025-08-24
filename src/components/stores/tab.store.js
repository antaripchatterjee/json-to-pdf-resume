import { create } from "zustand";
import AutoIncrementalTabIndex from "./utils/autoIncrementalTabIndex";

const useTabStore = create((set, get) => ({
  tabs: new Map(),
  tabStack: new Set(),
  addTab: () => {
    set((state) => {
      const tabIndex = AutoIncrementalTabIndex.getNext();
      const newTabs = new Map(state.tabs);
      newTabs.set(tabIndex, `New Tab ${tabIndex}`);
      const newTabStack = new Set(state.tabStack).add(tabIndex);
      return {
        tabs: newTabs,
        tabStack: newTabStack
      };
    });
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
  updateTab: (tabIndex, newLabel) => set((state) => {
    const newTabs = new Map(state.tabs);
    newTabs.set(tabIndex, newLabel);
    return { tabs: newTabs };
  }),
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
  }
}));

export default useTabStore;