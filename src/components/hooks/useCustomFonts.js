import { useContext } from "react";
import { CustomFontsContext } from "../contexts/CustomFontsContext";

export function useCustomFonts() {
  return useContext(CustomFontsContext);
}
