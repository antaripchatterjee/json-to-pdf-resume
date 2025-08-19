import React, { useRef } from "react";
import AceEditor from "react-ace";

import ace from "ace-builds/src-noconflict/ace";

import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-tomorrow_night";
import "ace-builds/src-noconflict/theme-solarized_dark";
import "ace-builds/src-noconflict/theme-kuroir";
import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/theme-katzenmilch";
import "ace-builds/src-noconflict/theme-merbivore";
import "ace-builds/src-noconflict/theme-nord_dark";
import "ace-builds/src-noconflict/theme-textmate";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-xcode";
import "ace-builds/src-noconflict/theme-twilight";
import "ace-builds/src-noconflict/theme-terminal";

import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/snippets/json";

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/worker-json";

// import { handleJsonChange } from '../../utils/handleJsonChange';
import { useJSONEditorStore, useWorkspaceStore } from "../stores/workspace.store";
// import { handleJSONEditorLoading, boilerplateCompleter } from '../../utils/handleJSONEditorLoading';


export default function JSONEditor({ tabIndex }) {
  const editorRef = useRef(null);
  // Set base path for dynamic loading
  ace.config.set("basePath", "/node_modules/ace-builds/src-noconflict");

  // Register custom completer
  // ace.require("ace/ext/language_tools").addCompleter(boilerplateCompleter);

  const { theme, fontSize, indentSize } = useJSONEditorStore();
  
  const content = useWorkspaceStore(
    (state) => state.getJSONContent(tabIndex).content
  );
  const setJSONContent = useWorkspaceStore((state) => state.setJSONContent);
  const setEditorState = useWorkspaceStore((state) => state.setEditorState);

  return (
    <AceEditor
      height="100%"
      width="100%"
      mode="json"
      theme={theme || "github"}
      onLoad={editor => {
        editorRef.current = editor;
        // handleJSONEditorLoading(editor)
        const saved = useWorkspaceStore.getState().getJSONContent(tabIndex);
        editor.moveCursorTo(saved.cursor.row, saved.cursor.column);
        editor.scrollToLine(saved.cursor.row, true, true, () => {});
        if (saved.selectionRange) {
          editor.selection.setSelectionRange(saved.selectionRange);
        }
      }}
      onChange={value => {
        setJSONContent(value);
        // try {
        //   setParsedContent(JSON.parse(value))
        // } catch {

        // }
      }}
      onCursorChange={() => {
        if (editorRef.current) {
          setEditorState(tabIndex, editorRef.current); // <- pass real editor
        }
      }}
      onSelectionChange={() => {
        if (editorRef.current) {
          setEditorState(tabIndex, editorRef.current);
        }
      }}
      onScroll={() => {
        if (editorRef.current) {
          setEditorState(tabIndex, editorRef.current);
        }
      }}
      name={`json-editor-${tabIndex}`}
      fontSize={fontSize}
      value={content}
      editorProps={{ $blockScrolling: true }}
      setOptions={{
        showLineNumbers: true,
        tabSize: {indentSize},
        useWorker: true,
        wrap: true,
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true,
        fontFamily: 'Consolas, monospace'
      }}
    />
  );
}
