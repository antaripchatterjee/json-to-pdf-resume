import { create } from "zustand";
// import AceEditorContent from "./utils/aceEditorContent";
import * as monaco from 'monaco-editor';

export const useEditorStore = create(set => ({
  theme: 'vs-dark',
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
  // Map: path (string) -> { model, viewState }
  editors: new Map(),

  // Create or return existing model
  createOrGetModel: (path, language, initialValue, monaco) => {
    const uri = monaco.Uri.parse(`file:///${path}`);
    let model = monaco.editor.getModel(uri);

    if (!model) {
      model = monaco.editor.createModel(initialValue, language, uri);
    }

    return model;
  },

  // Save editor view state (cursor, scroll, selections)
  saveViewState: (path, editorInstance) => {
    const editors = new Map(get().editors);
    if (!editors.has(path)) return;

    const viewState = editorInstance.saveViewState();
    editors.set(path, { ...editors.get(path), viewState });
    set({ editors });
  },

  // Restore editor view state
  restoreViewState: (path, editorInstance) => {
    const editors = get().editors;
    if (!editors.has(path)) return;

    const { viewState } = editors.get(path);
    if (viewState) {
      editorInstance.restoreViewState(viewState);
    }
    editorInstance.focus();
  },

  // Get content of a file
  getValue: (path) => {
    const editors = get().editors;
    return editors.has(path) ? editors.get(path).model.getValue() : "";
  },

  // Update content programmatically
  setValue: (path, newValue) => {
    const editors = new Map(get().editors);
    if (editors.has(path)) {
      editors.get(path).model.setValue(newValue);
      set({ editors });
    }
  }
}));
