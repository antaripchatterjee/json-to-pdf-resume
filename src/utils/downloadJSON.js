/**
 * Downloads the current JSON content as a file and saves it to localStorage.
 * @param {string} jsonContent - The JSON string to download.
 */
export function downloadJSON(jsonContent, editorTheme, editorFontSize) {
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'resume.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  localStorage.setItem('userChoice.resumeDataContent', jsonContent);
  localStorage.setItem('userChoice.aceEditorTheme', editorTheme);
  localStorage.setItem('userChoice.aceEditorFontSize', editorFontSize);
}