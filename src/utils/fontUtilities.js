import { decompress } from "woff2-encoder";
import * as csstree from "css-tree";

import { getUrl } from "./urlUtilities";
import { fetchWithTimeout } from './fetchUtilities';


async function convertWoff2ToTtf(woff2Buffer) {
  try {
    const ttfBuffer = await decompress(woff2Buffer);
    return ttfBuffer;
  } catch (e) {
    console.warn(e)
    throw Error('WOFF2 to TTF decompression failed');
  }
};

function detectFontFormatFromBytes(bytes, oneOf = null) {
  const [b0, b1, b2, b3] = bytes;
  let fontFormat = null;

  if (b0 === 0x77 && b1 === 0x4F && b2 === 0x46) {
    if (b3 === 0x32) {
      fontFormat = 'woff2'; // wOF2
    } else if (b3 === 0x46) {
      fontFormat = 'woff'; // wOFF
    }
  } else if (b0 === 0x00 && b1 === 0x01 && b2 === 0x00 && b3 === 0x00) {
    fontFormat = 'truetype'; // \0\1\0\0
  } else if (b0 === 0x4F && b1 === 0x54 && b2 === 0x54 && b3 === 0x4F) {
    fontFormat = 'opentype'; // OTTO
  }
  if (oneOf?.includes(fontFormat) ?? fontFormat) {
    return fontFormat;
  } else {
    return "unknown";
  }
}


async function fetchFontBlobData(urlString, format) {
  const url = getUrl(urlString);
  if (!url) throw new Error('Font source URL should be a valid http(s) link.');

  const resp = await fetchWithTimeout(url);
  if (!resp.ok) throw new Error(`Fetch error on ${url}`);

  const contentType = resp.headers.get('Content-Type')?.toLowerCase();
  const buffer = await resp.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  let finalFormat = format;

  // Step 1: If format is "runtime", detect dynamically
  if (format === 'runtime') {
    // Step 2: Try detecting via contentType
    if (contentType === 'font/ttf' || contentType === 'application/x-font-ttf' ||
      contentType === 'application/font-ttf') {
      finalFormat = 'truetype';
    } else if (contentType === 'font/otf' || contentType === 'application/x-font-opentype') {
      finalFormat = 'opentype';
    } else if (contentType === 'font/woff2' || contentType === 'application/font-woff2') {
      finalFormat = 'woff2';
    } else if (contentType === 'font/woff' || contentType === 'application/font-woff') {
      finalFormat = 'woff';
    } else if (contentType === 'font/sfnt' || contentType === 'application/font-sfnt' || contentType === 'application/x-font-sfnt') {
      // Step 3: SFNT wrapper — detect using first 4 bytes
      finalFormat = detectFontFormatFromBytes(bytes, ['truetype', 'opentype']);
    } else {
      // Unknown content-type — fallback to byte detection
      finalFormat = detectFontFormatFromBytes(bytes);
    }
  }

  // Step 4: Target content type
  let targetContentType;
  switch (finalFormat) {
    case 'woff':
      targetContentType = 'font/woff';
      break;
    case 'woff2': // we're converting it
    case 'truetype':
    case 'ttf':
      targetContentType = 'font/ttf';
      break;
    case 'opentype':
    case 'otf':
      targetContentType = 'font/otf';
      break;
    default:
      throw new Error(`Unsupported or unknown font format`);
  }

  // Step 5: Return Blob URL
  if (finalFormat === 'woff2') {
    const ttfBuffer = await convertWoff2ToTtf(buffer);
    const blob = new Blob([ttfBuffer], { type: targetContentType });
    return URL.createObjectURL(blob);
  } else {
    const blob = new Blob([buffer], { type: targetContentType });
    return URL.createObjectURL(blob);
  }
}

function getFontWeightsFromRange([start, stop]) {
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

function parseCSSDocument(cssText) {
  const acceptedFormats = ["woff", "woff2", "truetype", "ttf", "opentype", "otf"];
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
  return fontFaces;
}

export async function getFontFacesFromCSS(cssText) {
  const fontFaces = parseCSSDocument(cssText);
  const allFontPromises = [];

  for (const { fontWeight, fontStyle, fontFamily, src } of fontFaces) {
    const fontWeights = getFontWeightsFromRange(
      fontWeight
        ? fontWeight.split(/[\D]+/g, 2).map((v) => parseInt(v, 10))
        : [400]
    );

    for (const weight of fontWeights) {
      for (const { url, format } of src) {
        const promise = fetchFontBlobData(url, format)
          .then(objectUrl => ({
            src: objectUrl,
            fontStyle: fontStyle ?? null,
            fontWeight: weight,
            url,
            fontFamily
          }))
          .catch(err => {
            console.warn(`Failed to load font from ${url}`, err);
            return null; // we will filter it out later
          });

        allFontPromises.push(promise);
      }
    }
  }

  // Wait for all fonts to load in parallel
  const resolvedFonts = (await Promise.all(allFontPromises)).filter(Boolean);

  // Group by fontFamily
  const fontMap = new Map();

  for (const font of resolvedFonts) {
    if (!fontMap.has(font.fontFamily)) {
      fontMap.set(font.fontFamily, []);
    }
    fontMap.get(font.fontFamily).push({
      src: font.src,
      fontWeight: font.fontWeight,
      fontStyle: font.fontStyle,
      url: font.url
    });
  }

  // Convert Map to final array
  return Array.from(fontMap.entries()).map(([family, fonts]) => ({
    family,
    fonts
  }));
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
  const fonts = await getFontFacesFromCSS(cssText, url.toString());
  return fonts;
}