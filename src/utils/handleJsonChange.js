/**
 * Handles changes in the JSON editor, updates state and localStorage.
 * @param {string} value - The new JSON string from the editor.
 * @param {Function} setJsonContent - State setter for JSON content.
 * @param {Function} setParsedData - State setter for parsed JSON object.
 */
export function handleJsonChange(value, setJsonContent, setParsedData) {
  setJsonContent(value);
  localStorage.setItem('userChoice.resumeDataContent', value);
  try {
    setParsedData(JSON.parse(value));
  } catch {
    setParsedData(null);
    console.error('Invalid JSON in localStorage');
  }
}