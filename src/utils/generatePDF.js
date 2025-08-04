import { pdf } from '@react-pdf/renderer';

/**
 * Generates a PDF from the JSON content and updates blobUrl and localStorage.
 * @param {string} jsonContent - The JSON string to render.
 * @param {Function} setBlobUrl - State setter for the PDF blob URL.
 * @param {Function} ResumeRenderer - The React component to render the PDF.
 */
export async function generatePDF(jsonContent, setBlobUrl, ResumeRenderer) {
  try {
    const parsed = JSON.parse(jsonContent);
    // Dynamically create the element to avoid JSX/react syntax in this file
    const element = ResumeRenderer ? ResumeRenderer({ data: parsed }) : null;
    if (!element) throw new Error('ResumeRenderer component is required');
    const blob = (await pdf(element)).toBlob();
    setBlobUrl(URL.createObjectURL(blob));
    localStorage.setItem('userChoice.resumeDataContent', jsonContent);
  } catch {
    setBlobUrl(null);
    alert('Cannot generate PDF. JSON is invalid or ResumeRenderer missing.');
  }
}