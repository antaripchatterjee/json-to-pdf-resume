// handleFileUpload.js

/**
 * Handles uploading and reading a JSON file, updating state and localStorage.
 * @param {Event} e - The file input change event.
 * @param {Function} setJsonContent - State setter for JSON content string.
 * @param {Function} setParsedData - State setter for parsed JSON object.
 */
export function handleFileUpload(e, setJsonContent, setParsedData) {
  const reader = new FileReader();
  reader.onload = (evt) => {
    const content = evt.target.result;
    setJsonContent(content);
    localStorage.setItem('userChoice.resumeDataContent', content);
    try {
        const parsed = JSON.parse(content);
        setParsedData(parsed);
    } catch {
        setParsedData(null);
        alert('Invalid JSON in uploaded file');
    }
  };
  reader.readAsText(e.target.files[0]);
}