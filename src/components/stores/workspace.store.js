import { create } from "zustand";
import AceEditorContent from "./utils/aceEditorContent";

export const useJSONEditorStore = create(set => ({
  theme: 'github',
  fontSize: 16,
  indentSize: 2,
  setTheme: (theme) => set(() => ({
    theme
  })),
  setFontSize: (fontSize) => set(() => ({
    fontSize
  })),
  setIndentSize: (indentSize) => set(state => ({
    indentSize: ([1, 2, 4]).includes(indentSize)
      ? indentSize : state.indentSize
  }))
}));

export const usePDFContainerStore = create(set => ({
  pdfFont: 'Times-Roman',
  renderPDF: true,
  setPDFFont: (pdfFont) => set(() => ({
    pdfFont
  })),
  togglePDFRendering: () => set((state) => ({
    renderPDF: !state.renderPDF
  }))
}));

export const useWorkspaceStore = create((set, get) => ({
  jsonContents: new Map(),

  setJSONContent: (tabIndex, content) =>
    set((state) => {
      const newMap = new Map(state.jsonContents);
      const existing = newMap.get(tabIndex) || new AceEditorContent();
      existing.content = content;
      newMap.set(tabIndex, existing);
      return { jsonContents: newMap };
    }),

  setEditorState: (tabIndex, editor) =>
    set((state) => {
      const newMap = new Map(state.jsonContents);
      const existing = newMap.get(tabIndex) || new AceEditorContent();

      existing.cursor = editor.getCursorPosition();
      existing.firstVisibleRow = editor.getFirstVisibleRow();
      existing.lastVisibleRow = editor.getLastVisibleRow();
      existing.selectionRange = editor.getSelectionRange();

      newMap.set(tabIndex, existing);
      return { jsonContents: newMap };
    }),

  getJSONContent: (tabIndex) => {
    const map = get().jsonContents;
    return map.get(tabIndex) || new AceEditorContent();
  },
}));
