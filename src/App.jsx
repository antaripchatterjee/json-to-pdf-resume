import React, { useEffect, useState, useRef } from 'react';
import { PDFViewer, Font } from '@react-pdf/renderer';

import ResumeRenderer from './components/ResumeRenderer';
import { handleFileUpload } from './utils/handleFileUpload';
import { downloadJSON } from './utils/downloadJSON';

import JSONEditor from './components/JSONEditor';
import CustomFontModal from './components/CustomFontModal';
// import CustomFontsProvider from './components/CustomFontsProvider';

// import { useCustomFonts } from './components/hooks/useCustomFonts';

import './App.css';
import ToggleButton from './components/ToggleButton';

const BOILERPLATES = {
  '!xyz': `{
  "type": "xyz",
  "props": {}
}`,
  '!btn': `{
  "type": "button",
  "label": "Click Me"
}`
};

// // List your fonts here (add more as needed)
// const availableFonts = [
//   {
//     family: 'Noto Serif',
//     src: '/fonts/Noto_Serif/NotoSerif-VariableFont_wdth,wght.ttf',
//   },
//   {
//     family: 'Bitcount Prop Double',
//     src: '/fonts/Bitcount_Prop_Double/BitcountPropDouble-VariableFont_CRSV,ELSH,ELXP,slnt,wght.ttf',
//   },
// ];

// // Dynamically register all fonts before App is used
// availableFonts.forEach(font => {
//   try {
//     Font.register({ family: font.family, src: font.src });
//   } catch {
//     // ignore
//   }
// });

const themes = [
  'github', 'tomorrow_night', 'solarized_dark', 'kuroir', 'dracula', 'katzenmilch', 
  'merbivore', 'nord_dark', 'textmate', 'monokai', 'xcode', 'twilight', 'terminal'
];

const colorModes = ['system', 'light', 'dark'];

const availableFonts = [
  {family: 'Times-Roman'},
  {family: 'Courier'},
  {family: 'Courier-Bold'},
  {family: 'Courier-Oblique'},
  {family: 'Courier-BoldOblique'},
  {family: 'Helvetica'},
  {family: 'Helvetica-Bold'},
  {family: 'Helvetica-Oblique'},
  {family: 'Helvetica-BoldOblique'},
  {family: 'Times-Bold'},
  {family: 'Times-Italic'},
  {family: 'Times-BoldItalic'},
  ]
function App() {
  const localRemember = (localStorage.getItem('userChoice.rememberChoices') ?? 'false') == 'true'; 

  const [colorMode, setColorMode] = useState(colorModes[0]); // 'light', 'dark', or 'system'

  const [jsonContent, setJsonContent] = useState('');
  const [parsedData, setParsedData] = useState(null);

  // Editor-only state
  const [editorTheme, setEditorTheme] = useState(themes[0]);
  const [editorFontSize, setEditorFontSize] = useState(16);

  // PDF-only state
  const [pdfFont, setPdfFont] = useState(availableFonts[0].family);
  const [renderPDF, setRenderPDF] = useState(true);
  const [showCustomFontModal, setShowCustomFontModal] = useState(false);
  const [customFonts, setCustomFonts] = useState([]);
  const [rememberChoices, setRememberChoices] = useState(localRemember);

  const isFirstMount = useRef(true);
  
  useEffect(() => {
    if (rememberChoices) {
      if(isFirstMount.current) {
        isFirstMount.current = false;
        // Load all values from localStorage
        const localJson = localStorage.getItem('userChoice.resumeDataContent');
        const localThemeName = localStorage.getItem('userChoice.aceEditorTheme');
        const localEditorFontSize = parseInt(localStorage.getItem('userChoice.aceEditorFontSize'), 10);
        const localPdfFont = localStorage.getItem('userChoice.pdfFont');
        const localRenderPDF = localStorage.getItem('userChoice.renderPDF');
        const localColorMode = localStorage.getItem('userChoice.colorMode');
        if (localJson) {
          setJsonContent(localJson);
          try {
            setParsedData(JSON.parse(localJson));
          } catch {
            setParsedData(null);
          }
        }
        if (localThemeName && themes.includes(localThemeName)) setEditorTheme(localThemeName);
        if (!Number.isNaN(localEditorFontSize) && localEditorFontSize >= 10 && localEditorFontSize <= 40) setEditorFontSize(parseInt(localEditorFontSize, 10));
        if (localPdfFont) setPdfFont(localPdfFont);
        if (localRenderPDF !== null) setRenderPDF(localRenderPDF === "true");
        if (localColorMode && colorModes.includes(localColorMode)) setColorMode(localColorMode);
      } else {
        localStorage.setItem('userChoice.aceEditorTheme', editorTheme);
        localStorage.setItem('userChoice.aceEditorFontSize', editorFontSize);
        localStorage.setItem('userChoice.pdfFont', pdfFont);
        localStorage.setItem('userChoice.renderPDF', renderPDF);
        localStorage.setItem('userChoice.colorMode', colorMode);
        localStorage.setItem('userChoice.rememberChoices', 'true');
      }
    } else {
      isFirstMount.current = false; // Reset for next mount
      // Remove all related keys if rememberChoices is false
      localStorage.removeItem('userChoice.resumeDataContent');
      localStorage.removeItem('userChoice.aceEditorTheme');
      localStorage.removeItem('userChoice.aceEditorFontSize');
      localStorage.removeItem('userChoice.pdfFont');
      localStorage.removeItem('userChoice.renderPDF');
      localStorage.removeItem('userChoice.colorMode');
      localStorage.removeItem('userChoice.rememberChoices');
    }
  }, [rememberChoices, editorTheme, editorFontSize, pdfFont, renderPDF, colorMode]);

  useEffect(() => {
    const root = document.documentElement;
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      const isDark = colorMode === "dark"
        || (colorMode === "system" && systemPrefersDark.matches);
      root.classList.toggle("dark", isDark);
    };

    applyTheme(); // initial application

    // Listen to system theme changes only if "system" is selected
    if (colorMode === "system") {
      systemPrefersDark.addEventListener("change", applyTheme);
      return () => {
        systemPrefersDark.removeEventListener("change", applyTheme);
      };
    }
  }, [colorMode])


  
  
  // Handler to register and use custom font
  const handleLoadFont = (fontObj) => {
    try {
      Font.register({ ...fontObj });
      setCustomFonts(prev => [...prev, fontObj]);
      setPdfFont(fontObj.family);
    } catch (e) {
      console.warn(e)
      throw new Error(`Failed to register font: ${fontObj.family}`);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-800 text-black dark:text-whitesmoke font-courier">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6 text-theme-light-primary dark:text-theme-dark-primary">
          JSON to PDF Résumé
        </h1>
        {/* Controls */}
        <div className="flex flex-wrap gap-4 items-center mb-4">
          <label className="flex flex-col text-sm font-medium w-52">
            <span>Upload A JSON</span>
            <input
              type="file"
              accept=".json"
              className="mt-1 border border-gray-300 rounded px-2 py-1 bg-white text-black dark:bg-black dark:text-whitesmoke"
              onChange={e => handleFileUpload(e, setJsonContent, setParsedData)}
            />
          </label>
          <label className="flex flex-col text-sm font-medium">
            <span>Font Size</span>
            <input
              type="number"
              min="10"
              max="40"
              step="1"
              className="mt-1 border border-gray-300 rounded px-2 py-1 w-20 bg-white text-black dark:bg-black dark:text-whitesmoke"
              value={editorFontSize}
              onChange={e => {
                const size = parseInt(e.target.value, 10);
                if (!Number.isNaN(size) && size >= 10 && size <= 40) {
                  setEditorFontSize(size);
                }
              }}
            />
          </label>
          <label className="flex flex-col text-sm font-medium">
            <span>Select Editor Theme</span>
            <select
              className="mt-1 border border-gray-300 rounded px-2 py-1 capitalize bg-white text-black dark:bg-black dark:text-whitesmoke"
              value={editorTheme}
              onChange={e => setEditorTheme(e.target.value)}
            >
              {themes.map((theme) => (
                <option key={theme} value={theme} className='capitalize'>
                  {theme.split(/[_]+/g).join(' ')}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col text-sm font-medium">
            <span>Select PDF Font</span>
            <select
              className="mt-1 border border-gray-300 rounded px-2 py-1 capitalize bg-white text-black dark:bg-black dark:text-whitesmoke"
              value={pdfFont}
              onChange={e => {
                e.preventDefault();
                const selectedOption = e.target.children[e.target.selectedIndex];
                if(selectedOption.getAttribute('data-action-after-select') === 'open-font-modal') {
                  setShowCustomFontModal(true);
                } else {
                  setShowCustomFontModal(false);
                  setPdfFont(e.target.value);
                }
              }}>
              {[
                {family: 'add-new-font'}, 
                ...availableFonts, 
                ...customFonts
              ].map((font, index) => (
                <option 
                  key={`font-family-${index}`} 
                  value={font.family} 
                  className="capitalize"
                  {...{
                    'data-action-after-select': index === 0 
                      ? 'open-font-modal' : 'set-pdf-font'
                  }}
                  >
                  {font.family.split(/[\W]+/g).join(' ')}
                </option>
              ))}
            </select>
          </label>
          <ToggleButton
            label="Render PDF"
            checked={renderPDF}
            onChange={(e) => setRenderPDF(e.target.value)}
          />
          <label className="flex flex-col text-sm font-medium">
            <span>Select Color Mode</span>
            <select
              className="mt-1 border border-gray-300 rounded px-2 py-1 capitalize bg-white text-black dark:bg-black dark:text-whitesmoke"
              value={colorMode}
              onChange={e => setColorMode(e.target.value)}
            >{colorModes.map((mode) => (
              <option key={mode} value={mode} className='capitalize'>
                {mode}
              </option>
            ))}</select>
          </label>
          <ToggleButton 
            label="Remember Choices"
            checked={rememberChoices}
            onChange={e => setRememberChoices(e.target.checked)}
          />
        </div>
        {/* Main Content */}
        <div className="flex min-h-full flex-col lg:flex-row gap-6">
          <div className="flex-1 w-full min-h-full bg-white dark:bg-gray-800 rounded-lg shadow">
            <JSONEditor
              value={jsonContent}
              theme={editorTheme}
              fontSize={editorFontSize}
              setValue={setJsonContent}
              setObject={setParsedData}
            />
            <button
              className="bg-theme-light-primary dark:bg-theme-dark-primary text-white px-4 py-2 my-2 w-full rounded font-semibold hover:bg-blue-900 transition lg:hidden"
              onClick={() => downloadJSON(jsonContent, editorTheme, editorFontSize)}
            >
              Save JSON
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center bg-gray-700 rounded-lg shadow pdf-renderer-container">
            {renderPDF ? (
              parsedData ? (
                <PDFViewer style={{ width: '100%', height: '100%', border: "none" }}>
                  <ResumeRenderer data={parsedData} fontFamily={pdfFont} />
                </PDFViewer>
              ) : (
                <div className="text-xl font-bold text-gray-600">No PDF content available to display</div>
              )
            ) : (
              <div className="text-xl font-bold text-gray-600">PDF rendering is disabled.</div>
            )}
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-6 mb-4">
            <button
              className="bg-theme-light-primary dark:bg-theme-dark-primary text-white px-4 py-2 my-2 w-full rounded font-semibold hover:bg-blue-900 transition not-lg:hidden"
              onClick={() => downloadJSON(jsonContent, editorTheme, editorFontSize)}
            >
              Save JSON
            </button>
            <button
              className="bg-theme-light-primary dark:bg-theme-dark-primary text-white px-4 py-2 my-2 w-full rounded font-semibold hover:bg-blue-900 transition"
              onClick={() => 0}
            >
              Download PDF
            </button>
        </div>
        <CustomFontModal
          isOpen={showCustomFontModal}
          onClose={() => setShowCustomFontModal(false)}
          onLoadFont={handleLoadFont}
        />
      </div>
    </div>
  );
}

export default App;
