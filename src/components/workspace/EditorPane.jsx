import React, { useRef } from "react";
import Editor from "@monaco-editor/react";
import { useWorkspaceStore } from "../stores/workspace.store";

export default function EditorPane({ path }) {
  const editorRef = useRef(null);
  const { createOrGetModel, saveViewState, restoreViewState } = useWorkspaceStore();

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;

    // Create or get persistent model
    const model = createOrGetModel(path, "json", "", monaco);
    editor.setModel(model);

    // Restore state (cursor, scroll, selection, etc.)
    restoreViewState(path, editor);

    // Save state on blur
    editor.onDidBlurEditorWidget(() => {
      saveViewState(path, editor);
    });
  }

  return (
    <Editor
      height="95%"
      theme="vs-dark"
      defaultLanguage="json"
      path={path}
      onMount={handleEditorDidMount}
      options={{ automaticLayout: true }}
    />
  );
}
