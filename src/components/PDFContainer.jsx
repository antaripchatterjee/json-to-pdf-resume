import React from "react";
import { PDFViewer } from '@react-pdf/renderer';
import ResumeRenderer from './ResumeRenderer';

export default function PDFContainer({ renderPDF, parsedData, pdfFont }) {
  return (
    <div 
      className="flex flex-1 items-center justify-center bg-gray-700 rounded-lg shadow pdf-viewer-container"
    >
      {renderPDF ? (
        parsedData ? (
          <PDFViewer style={{ width: "100%", border: "none" }}>
            <ResumeRenderer data={parsedData} fontFamily={pdfFont} />
          </PDFViewer>
        ) : (
          <div className="text-xl font-bold text-gray-600">No PDF content available to display</div>
        )
      ) : (
        <div className="text-xl font-bold text-gray-600">PDF rendering is disabled.</div>
      )}

    </div>
  );
}
