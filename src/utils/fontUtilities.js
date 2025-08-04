import { decompress } from "woff2-encoder";
import * as csstree from "css-tree";

import { fetchWithTimeout } from './fetchUtilities';

export async function convertWoff2ToTtf(url) {
  try {
    const woff2Buffer = await fetch(url).then((res) => res.arrayBuffer());
    const ttfBuffer = await decompress(woff2Buffer);
    const blob = new Blob([ttfBuffer], { type: "font/ttf" });
    return URL.createObjectURL(blob);
  } catch (e) {
    throw Error(`WOFF2 to TTF decompression failed - ${e.message}`);
  }
};

export function getFontWeightsFromRange([start, stop]) {
  if (stop === undefined) {
    stop = start;
  }
  const step = 100;
  const result = [];
  for (let i = start; i <= stop; i += step) {
    result.push(i);
  }
  return result;
}

export function organizeFontInfo(fontFacesData) {
  return fontFacesData.reduce((acc, fontFaceData) => {
    const fonts = fontFaceData.fontWeights.flatMap((fontWeight) =>
      fontFaceData.sources.map(({ url, format }) => ({
        src: getUrl(url) && url,
        fontStyle: fontFaceData.fontStyle,
        fontWeight,
        url,
        fmt: format,
      })).filter(({ src }) => src !== null)
    );

    const existing = acc.find(
      (item) => item.family === fontFaceData.fontFamily
    );
    if (existing) {
      existing.fonts.push(...fonts);
    } else {
      acc.push({
        family: fontFaceData.fontFamily,
        preloaded: false,
        fonts: [...fonts],
      });
    }
    return acc;
  }, []);
}

export function getFontFacesFromCSS(cssText, urlSting) {
  const acceptedFormats = ["woff", "woff2", "truetype", "ttf"];
  const fontFaces = [];

  const ast = csstree.parse(cssText);
  csstree.walk(ast, {
    visit: "Atrule",
    enter(node) {
      if (node.name !== "font-face") return;

      const fontFace = {
        src: []
      };
      node.block.children.forEach((decl) => {
        const prop = decl.property;
        const camelProp = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

        if (prop === "src") {
          const srcArray = [];
          let url = null;
          let format = null;
          let skipSrc = false;

          decl.value.children.forEach((valNode) => {
            if (skipSrc) return;
            if (!url && valNode.type === "Url") {
              url = valNode.value;
              if (url) {
                srcArray.push({ url, format: "dynamic" });
              }
            } else if (valNode.type === "Function" && valNode.name === "format") {
              if (url) {
                const arg = valNode.children.first;
                if (arg && arg.type === "String") {
                  format = arg.value.toLowerCase();
                  if (format) {
                    if (acceptedFormats.includes(format)) {
                      srcArray[srcArray.length - 1].format = format;
                    } else {
                      srcArray.pop()
                    }
                  }
                }
              } else {
                skipSrc = true;
              }
            } else if (url && !format && valNode.type === "Operator" && valNode.value === ',') {
              format = "runtime";
            }
            if (url && format) {
              url = null;
              format = null;
            }
          });

          if (!skipSrc) {
            console.log(srcArray)
            fontFace.src.push(...srcArray);
          }
        } else {
          const valStr = csstree
            .generate(decl.value)
            .replace(/^['"]|['"]$/g, "");
          fontFace[camelProp] = valStr;
        }
      });
      if (fontFace.src.length > 0) {
        fontFaces.push(fontFace);
      }
    },
  });

  // console.log(fontFaces)
  return fontFaces.map(({ fontWeight, fontStyle, fontFamily, src }) => ({
    fontWeights: getFontWeightsFromRange(
      fontWeight
        ? fontWeight.split(/[\D]+/g, 2).map((v) => parseInt(v, 10))
        : [400]
    ),
    fontStyle: fontStyle ?? null,
    fontFamily,
    sources: src,
    url: urlSting
  }));

  // const organizedFontFaces = organizeFontInfo(
  //   fontFaces.map(({ fontWeight, fontStyle, fontFamily, src }) => ({
  //     fontWeights: getFontWeightsFromRange(
  //       fontWeight
  //         ? fontWeight.split(/[\D]+/g, 2).map((v) => parseInt(v, 10))
  //         : [400]
  //     ),
  //     fontStyle: fontStyle ?? "normal",
  //     fontFamily,
  //     groupName: `${fontFamily}-${fontStyle}`,
  //     sources: src,
  //   }))
  // );
  // return organizedFontFaces;
}

export async function fetchFontFacesFromCssUrl(url) {
  // console.log(url);
  const response = await fetchWithTimeout(url, {
    timeout: 30000
  });
  if (!response?.ok) throw new Error("Failed to fetch font");
  const contentType = response.headers.get("Content-Type");
  if (contentType !== 'text/css' && !contentType.startsWith("text/css;")) {
    throw new Error("Not a CSS link");
  }
  const cssText = await response.text();
  const fonts = getFontFacesFromCSS(cssText, url.toString());
  return fonts;
}