/**
 * Handles theme changes for the Ace editor.
 * @param {Event} e - The change event from the select input.
 * @param {Function} setEditorTheme - State setter for the editor theme.
 * @param {Array} themes - Array of available themes.
 */
export function handleThemeChange(e, setEditorTheme, themes) {
  const newTheme = e.target.value;
  if (themes.includes(newTheme)) {
    setEditorTheme(newTheme);
    localStorage.setItem('userChoice.aceEditorTheme', newTheme);
  } else {
    alert('Invalid theme selected');
  }
}

/**
 * Handles font size changes for the Ace editor.
 * @param {Event} e - The change event from the input.
 * @param {Function} setEditorFontSize - State setter for the editor font size.
 */
export function handleFontSizeChange(e, setEditorFontSize) {
  const size = parseInt(e.target.value, 10);
  if (size >= 10 && size <= 40) {
    setEditorFontSize(size);
    localStorage.setItem('userChoice.aceEditorFontSize', size);
  } else {
    alert('Font size must be between 10 and 40');
  }
}