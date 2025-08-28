import { create } from "zustand";

export const useEditorGlobalStore = create(set => ({
  theme: 'vs-dark',
  fontSize: 16,
  indentSize: 2,
  setTheme: (theme) => set(() => ({
    theme
  })),
  setFontSize: (fontSize) => set(() => ({
    fontSize
  })),
}));

export const useCurrentEditorStore = create((set, get) => ({
  activeEditor: null,
  indentSize: 4,

  setActiveEditor: (editor) => set(() => ({
    activeEditor: editor
  })),

  getActiveEditor: () => get().activeEditor,
  
  setIndentSize: (indentSize) => set(state => ({
    indentSize: ([1, 2, 4]).includes(indentSize)
      ? indentSize : state.indentSize
  })),
  getIndentSize: () => get().indentSize
}))

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
  editorPanes: new Map(),

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
    const editorPanes = new Map(get().editorPanes);
    if (!editorPanes.has(path)) return;

    const viewState = editorInstance.saveViewState();
    editorPanes.set(path, { ...editorPanes.get(path), viewState });
    set({ editorPanes });
  },

  // Restore editor view state
  restoreViewState: (path, editorInstance) => {
    const editorPanes = get().editorPanes;
    if (!editorPanes.has(path)) return;

    const { viewState } = editorPanes.get(path);
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
    const editorPanes = get().editorPanes;
    return editorPanes.has(path) ? editorPanes.get(path).model : null;
  },

  // Get the editor
  getEditor: (path) => {
    const editorPanes = get().editorPanes;
    return editorPanes.has(path) ? editorPanes.get(path).editor : null;
  },

  // Get content of a file
  getValue: (path) => {
    const editorPanes = get().editorPanes;
    return editorPanes.has(path) ? editorPanes.get(path).model.getValue() : "";
  },

  // Update content programmatically
  setValue: (path, newValue) => {
    const editorPanes = new Map(get().editorPanes);
    if (editorPanes.has(path)) {
      editorPanes.get(path).model.setValue(newValue);
      set({ editorPanes });
    }
  },
}));

