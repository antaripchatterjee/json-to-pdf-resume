import React from "react";
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

import { handleJsonChange } from '../utils/handleJsonChange';
import { handleJSONEditorLoading, boilerplateCompleter } from '../utils/handleJSONEditorLoading';


export default function JSONEditor({ value, theme, fontSize, setValue, setObject }) {
  // Set base path for dynamic loading
  ace.config.set("basePath", "/node_modules/ace-builds/src-noconflict");

  // Register custom completer
  ace.require("ace/ext/language_tools").addCompleter(boilerplateCompleter);

  return (
    <AceEditor
      mode="json"
      theme={theme || "github"}
      onLoad={editor => handleJSONEditorLoading(editor)}
      onChange={value => handleJsonChange(value, setValue, setObject)}
      name="json-editor"
      fontSize={fontSize}
      value={value}
      editorProps={{ $blockScrolling: true }}
      setOptions={{
        showLineNumbers: true,
        tabSize: 2,
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
