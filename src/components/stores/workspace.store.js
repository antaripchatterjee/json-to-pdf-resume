import { create } from "zustand";

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
  // Map: path -> { model, viewState }
  editors: new Map(),

  // Object: path -> cursor
  cursors: {},

  // Object: path -> breadcrumb
  breadcrumbs: {},

  // Create or return existing model
  createOrGetModel: (path, language, initialValue, monacoInstance) => {
    const uri = monacoInstance.Uri.parse(`file:///${path}`);
    let model = monaco.editor.getModel(uri);

    const editors = new Map(get().editors);

    if (!model) {
      model = monaco.editor.createModel(initialValue, language, uri);
    }

    if (!editors.has(path)) {
      editors.set(path, { model, editor: null, viewState: null });
      set({ editors });
    }

    return model;
  },

  setEditorInstance: (path, editor) => {
    const editors = new Map(get().editors);
    if (!editors.has(path)) return;

    const current = editors.get(path);
    editors.set(path, { ...current, editor });
    set({ editors });
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

  // Save cursor info separately
  saveCursor: (path, cursor) => {
    set((state) => ({
      cursors: {
        ...state.cursors,
        [path]: cursor,
      },
    }));
  },
  
  // Save breadcrumb info separately
  saveBreadcrumb: (path, breadcrumb) => {
    // console.log(breadcrumb)
    set(state => ({
      breadcrumbs: {
        ...state.breadcrumbs,
        [path]: breadcrumb
      }
    }))
  },

  // Get the model
  getModel: (path) => {
    const editors = get().editors;
    return editors.has(path) ? editors.get(path).model : null;
  },

  // Get the editor
  getEditor: (path) => {
    const editors = get().editors;
    return editors.has(path) ? editors.get(path).editor : null;
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
  },
}));

