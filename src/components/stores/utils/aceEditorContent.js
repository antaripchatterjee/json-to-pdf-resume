export default class AceEditorContent {
  constructor({
    content = "",
    cursor = { row: 0, column: 0 },
    firstVisibleRow = 0,
    lastVisibleRow = 0,
    selectionRange = null,
  } = {}) {
    this.content = content;
    this.cursor = cursor;
    this.firstVisibleRow = firstVisibleRow;
    this.lastVisibleRow = lastVisibleRow;
    this.selectionRange = selectionRange;
  }
}