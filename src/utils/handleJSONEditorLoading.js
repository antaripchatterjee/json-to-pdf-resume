import ace from "ace-builds/src-noconflict/ace";

// Boilerplate snippets to insert
const BOILERPLATES = {
  "!xyz": `{
  "type": "xyz",
  "props": {}
}`,
  "!btn": `{
  "type": "button",
  "label": "Click Me"
}`,
  "!input": `{
  "type": "input",
  "placeholder": "Enter text"
}`,
};

// Custom completer for "!xyz" style snippets
export const boilerplateCompleter = {
  getCompletions(editor, session, pos, prefix, callback) {
    if (!prefix.startsWith("!")) return callback(null, []);
    const suggestions = Object.keys(BOILERPLATES).map((key) => ({
      caption: key,
      value: BOILERPLATES[key],
      meta: "boilerplate",
    }));
    callback(
      null,
      suggestions.filter((s) => s.caption.startsWith(prefix))
    );
  },
};

export function handleJSONEditorLoading(editor) {

  // Add Enter key command to insert snippet if matches
  editor.commands.addCommand({
    name: "insertBoilerplateOnEnter",
    bindKey: { win: "Enter", mac: "Enter" },
    exec: function (editor) {
      const cursor = editor.getCursorPosition();
      const line = editor.session.getLine(cursor.row);
      const trimmed = line.trim();

      if (BOILERPLATES[trimmed]) {
        editor.session.replace(
          {
            start: { row: cursor.row, column: 0 },
            end: { row: cursor.row, column: line.length },
          },
          BOILERPLATES[trimmed]
        );
      } else {
        editor.insert("\n"); // default behavior
      }
    },
  });
}

export function handleJSONEditorSnippests(editor) {
  ace.config.set("basePath", "/node_modules/ace-builds/src-noconflict");
  ace.require("ace/ext/language_tools").addCompleter({
    getCompletions(editor, session, pos, prefix, callback) {
      if (!prefix.startsWith("!")) return callback(null, []);
      const suggestions = Object.keys(BOILERPLATES).map((key) => ({
        caption: key,
        value: BOILERPLATES[key],
        meta: "boilerplate",
      }));
      callback(
        null,
        suggestions.filter((s) => s.caption.startsWith(prefix))
      );
    },
  });
  //   editor.commands.addCommand({
  //     name: "insertBoilerplate",
  //     bindKey: { win: "Enter", mac: "Enter" },
  //     exec: function (editor) {
  //       const cursor = editor.getCursorPosition();
  //       const line = editor.session.getLine(cursor.row);
  //       const trimmed = line.trim();

  //       if (BOILERPLATES[trimmed]) {
  //         editor.session.replace(
  //           {
  //             start: { row: cursor.row, column: 0 },
  //             end: { row: cursor.row, column: line.length },
  //           },
  //           BOILERPLATES[trimmed]
  //         );
  //       } else {
  //         editor.insert("\n"); // default Enter
  //       }
  //     },
  //   });
}
