import React, { useEffect, useState, useRef } from 'react';
import { Font } from '@react-pdf/renderer';


// import { handleFileUpload } from './utils/handleFileUpload';
// import { downloadJSON } from './utils/downloadJSON';

// import SearchableSelect from './components/SearchableSelect';
// import JSONEditor from './components/JSONEditor';
// import CustomFontModal from './components/CustomFontModal';
// import PDFContainer from './components/PDFContainer';

import './App.css';
// import ToggleButton from './components/ToggleButton';
// import IconButton from './components/IconButton';
// import { ArrowDownOnSquareIcon } from '@heroicons/react/24/outline';
import Branding from './components/navber/Branding';
import TabContainer from './components/tab/TabContainer';

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
        { family: fontObj.family }
      ]);
      setPdfFont(fontObj.family);
    } catch (e) {
      console.warn(e)
      throw new Error(`Failed to register font: ${fontObj.family}`);
    }
  };

  return (
    <div className="max-w-screen min-w-screen min-h-screen max-h-screen bg-white dark:bg-gray-800 text-black dark:text-whitesmoke">
      <div className="w-screen h-screen mx-auto px-4 py-2">
        <Branding />
        <div className='w-full h-[80%]'>
          <TabContainer />
        </div>
      </div>
    </div>
  );
}

export default App;
