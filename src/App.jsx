import React, { useEffect, useState, useRef } from 'react';
import { Font } from '@react-pdf/renderer';


import { handleFileUpload } from './utils/handleFileUpload';
import { downloadJSON } from './utils/downloadJSON';

import SearchableSelect from './components/SearchableSelect';
import JSONEditor from './components/JSONEditor';
import CustomFontModal from './components/CustomFontModal';
import PDFContainer from './components/PDFContainer';

import './App.css';
import ToggleButton from './components/ToggleButton';
import IconButton from './components/IconButton';
import { ArrowDownOnSquareIcon } from '@heroicons/react/24/outline';

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

const appearances = ['system', 'light', 'dark'];

const availableFonts = [
  { family: 'Times-Roman' },
  { family: 'Courier' },
  { family: 'Courier-Bold' },
  { family: 'Courier-Oblique' },
  { family: 'Courier-BoldOblique' },
  { family: 'Helvetica' },
  { family: 'Helvetica-Bold' },
  { family: 'Helvetica-Oblique' },
  { family: 'Helvetica-BoldOblique' },
  { family: 'Times-Bold' },
  { family: 'Times-Italic' },
  { family: 'Times-BoldItalic' },
]
function App() {
  const localRemember = (localStorage.getItem('userChoice.rememberChoices') ?? 'false') == 'true';

  const [appearance, setAppearance] = useState(appearances[0]); // 'light', 'dark', or 'system'

  const [jsonContent, setJsonContent] = useState('');
  const [parsedData, setParsedData] = useState(null);

  // Editor-only state
  const [editorTheme, setEditorTheme] = useState(themes[0]);
  const [editorFontSize, setEditorFontSize] = useState(16);

  // PDF-only state
  const [pdfFont, setPdfFont] = useState("");
  const [renderPDF, setRenderPDF] = useState(true);
  const [showCustomFontModal, setShowCustomFontModal] = useState(false);
  const [customFonts, setCustomFonts] = useState([]);
  const [rememberChoices, setRememberChoices] = useState(localRemember);

  const isFirstMount = useRef(true);

  useEffect(() => {
    if (rememberChoices) {
      if (isFirstMount.current) {
        isFirstMount.current = false;
        // Load all values from localStorage
        const localJson = localStorage.getItem('userChoice.resumeDataContent');
        const localThemeName = localStorage.getItem('userChoice.aceEditorTheme');
        const localEditorFontSize = parseInt(localStorage.getItem('userChoice.aceEditorFontSize'), 10);
        const localPdfFont = localStorage.getItem('userChoice.pdfFont');
        const localRenderPDF = localStorage.getItem('userChoice.renderPDF');
        const localAppearance = localStorage.getItem('userChoice.appearance');
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
        if (localPdfFont) {
          setPdfFont(localPdfFont);
        } else {
          setPdfFont(availableFonts[0].family)
        }
        if (localRenderPDF !== null) setRenderPDF(localRenderPDF === "true");
        if (localAppearance && appearances.includes(localAppearance)) setAppearance(localAppearance);
      } else {
        localStorage.setItem('userChoice.aceEditorTheme', editorTheme);
        localStorage.setItem('userChoice.aceEditorFontSize', editorFontSize);
        localStorage.setItem('userChoice.pdfFont', pdfFont);
        localStorage.setItem('userChoice.renderPDF', renderPDF);
        localStorage.setItem('userChoice.appearance', appearance);
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
      localStorage.removeItem('userChoice.appearance');
      localStorage.removeItem('userChoice.rememberChoices');
    }
  }, [rememberChoices, editorTheme, editorFontSize, pdfFont, renderPDF, appearance]);

  useEffect(() => {
    const root = document.documentElement;
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      const isDark = appearance === "dark"
        || (appearance === "system" && systemPrefersDark.matches);
      root.classList.toggle("dark", isDark);
    };

    applyTheme(); // initial application

    // Listen to system theme changes only if "system" is selected
    if (appearance === "system") {
      systemPrefersDark.addEventListener("change", applyTheme);
      return () => {
        systemPrefersDark.removeEventListener("change", applyTheme);
      };
    }
  }, [appearance])

  // Handler to register and use custom font
  const handleLoadFont = (fontObj) => {
    try {
      Font.register({ ...fontObj });
      setCustomFonts(prev => [
        ...prev, 
        {family: fontObj.family}
      ]);
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
          {pdfFont && <SearchableSelect
            label="Select Font"
            onChange={async ({ selectedIndex, selectedOption }) => {
              if(selectedIndex === 0 && selectedOption.value === 'add-new-font') {
                setShowCustomFontModal(true)
              } else {
                setShowCustomFontModal(false);
                setPdfFont(selectedOption.value);
                return {
                  query: selectedOption.value.replace(/[\W]+/g, ' ')
                };
              }
              return null;
            }}
            options={[
              { family: "add-new-font", selectable: false },
              ...availableFonts,
              ...customFonts
            ].map(option => ({
              ...option,
              label: option.family.replace(/[\W]+/g, ' '),
              value: option.family,
              selected: (option.selectable ?? true) && (option.family === pdfFont)
            }))}
            optionKeyPrefix="font-family"
          />}
          <ToggleButton
            label="Render PDF"
            checked={renderPDF}
            onChange={(e) => setRenderPDF(!renderPDF)}
          />
          <label className="flex flex-col text-sm font-medium">
            <span>Select Appearance</span>
            <select
              className="mt-1 border border-gray-300 rounded px-2 py-1 capitalize bg-white text-black dark:bg-black dark:text-whitesmoke"
              value={appearance}
              onChange={e => setAppearance(e.target.value)}
            >{appearances.map((appearance) => (
              <option key={appearance} value={appearance} className='capitalize'>
                {appearance}
              </option>
            ))}</select>
          </label>
          <ToggleButton
            label="Remember Me"
            tooltip="Information will be stored in the browser."
            checked={rememberChoices}
            onChange={e => setRememberChoices(!rememberChoices)}
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
            <IconButton
              className="my-2 w-full lg:hidden"
              onClick={() => downloadJSON(jsonContent, editorTheme, editorFontSize)}
              icon={<ArrowDownOnSquareIcon className='h-6 w-4' />}
              label="Save JSON"
            />
          </div>
          <PDFContainer
            renderPDF={renderPDF}
            parsedData={parsedData}
            pdfFont={pdfFont}
          />
        </div>
        <div className="flex flex-col lg:flex-row gap-6 mb-4">
          <IconButton
            className="my-2 w-full not-lg:hidden"
            onClick={() => downloadJSON(jsonContent, editorTheme, editorFontSize)}
            icon={<ArrowDownOnSquareIcon className='h-6 w-4' />}
            label="Save JSON"
          />
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
