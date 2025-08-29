import React, { useRef } from "react";
import Editor, {useMonaco} from "@monaco-editor/react";
import Breadcrumb from "./Breadcrumb";
import { useWorkspaceStore } from "../stores/workspace.store";
import { useCurrentEditorStore } from "../stores/workspace.store";
import findBreadcrumbPath from "../../utils/quickParsers";

export default function EditorPane({ title, path }) {
  const editorRef = useRef(null);
  const { 
    setEditorInstance, 
    saveViewState, restoreViewState, 
    saveCursor, saveBreadcrumb } = useWorkspaceStore();
  
  const setActiveEditor = useCurrentEditorStore(state => state.setActiveEditor);

  function extractEditorInfo() {
    if (!editorRef.current) return;
    const editor = editorRef.current;
    const model = editor.getModel();
    const selections = editor.getSelections();
    if (!selections || selections.length === 0) return;

    const first = selections[0];
    const cursorPos = first.getPosition(); // blinking cursor
    const cursorOffset = model.getOffsetAt(cursorPos);

    let info = {};

    if (selections.length === 1) {
      if (first.isEmpty()) {
        // One cursor, no selection
        info = {
          line: cursorPos.lineNumber,
          column: cursorPos.column,
          offset: cursorOffset,
        };
      } else {
        // One cursor, with selection
        const selectedText = model.getValueInRange(first);
        info = {
          line: cursorPos.lineNumber,
          column: cursorPos.column,
          offset: cursorOffset,
          selectedCount: [...selectedText].length,
        };
      }
    } else {
      if (selections.every(sel => sel.isEmpty())) {
        // Multi cursor, no selection
        info = {
          cursorCount: selections.length,
          offset: cursorOffset,
        };
      } else {
        // Multi cursor, selections
        let totalSelectedLength = 0;
        for (const sel of selections) {
          if (!sel.isEmpty()) {
            totalSelectedLength += [...model.getValueInRange(sel)].length;
          }
        }
        info = {
          selectionCount: selections.length,
          totalSelectedChars: totalSelectedLength,
          offset: cursorOffset,
        };
      }
    }

    saveCursor(path, info);
    
    const value = model.getValue();
    const langId = model.getLanguageId();
    const breadcrumb = findBreadcrumbPath(langId, value, cursorOffset);
    saveBreadcrumb(path, breadcrumb);
  }

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;

    console.log('onMount called')
    // Create or get persistent model
    // const model = createOrGetModel(path, "json", "", monaco);
    // editor.setModel(model);

    // Save editor instance in store
    setEditorInstance(path, editor);


    // Restore state (cursor, scroll, selection, etc.)
    restoreViewState(path, editor);

    // Save state on blur
    editor.onDidBlurEditorWidget(() => {
      saveViewState(path, editor);
    });

    // Listen for cursor changes
    editor.onDidChangeCursorSelection(extractEditorInfo);
    // editor.onDidFocusEditorWidget(() => {
    //   setActiveEditor(editor);
    // });
    // setActiveEditor(editor);
  }

  function handleOnChange(value) {
    // console.log("Content:", value ?? editorRef.current?.getValue());
    extractEditorInfo();
  }

  return (
    <div className="w-full h-full flex flex-col">
      <Breadcrumb 
        title={title}
        path={path}
      />
      <Editor
        height="100%"
        theme="vs-dark"
        defaultLanguage="json"
        
        path={path}
        onChange={handleOnChange}
        onMount={handleEditorDidMount}
        options={{ automaticLayout: true }}
      />
    </div>
  );
}
