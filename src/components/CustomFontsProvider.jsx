import React, { useState } from "react";
import { CustomFontsContext } from "./contexts/CustomFontsContext";


export default function CustomFontsProvider ({ children }) {
  const [customFonts, setCustomFonts] = useState([]);

  return (
    <CustomFontsContext.Provider value={{ customFonts, setCustomFonts }}>
      {children}
    </CustomFontsContext.Provider>
  );
}

