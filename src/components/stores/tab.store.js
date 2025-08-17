import { create } from "zustand";
import TabMap from "./utils/tabMap";

const useTabStore = create((set) => ({
  tabs: new TabMap(),
  addTab: () => set((state) => ({
    tabs: state.tabs.addTab()
  })),
  removeTab: (tabIndex) => set((state) => ({
    tabs: state.tabs.removeTab(tabIndex)
  })),
  updateTab: (tabIndex, newLabel) => set((state) => ({
    tabs: state.tabs.updateTab(tabIndex, newLabel)
  }))
}));

export default useTabStore;