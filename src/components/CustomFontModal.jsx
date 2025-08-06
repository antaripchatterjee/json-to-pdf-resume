import React, { useState } from "react";
import { ArrowPathIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";

import LabelWithTooltip from './LabelWithTooltip';
import IconButton from "./IconButton";
import ErrorLabel from "./ErrorLabel";

import { getUrl } from "../utils/urlUtilities";
import { fetchFontFacesFromCssUrl } from "../utils/fontUtilities";



export default function CustomFontModal({ isOpen, onClose, onLoadFont }) {
  const [fontUrl, setFontUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [runFilter, setRunFilter] = useState(false);
  const [error, setError] = useState(null);

  const handleFetch = async (runFilter) => {
    const parsedUrl = getUrl(fontUrl);
    if (!parsedUrl) return;

    setLoading(true);
    setError(null);

    try {
      const fontFaces = await fetchFontFacesFromCssUrl(parsedUrl);
      if (!fontFaces.length) throw new Error("Could not find any valid font endpoints");
      console.log(fontFaces)
      fontFaces.forEach(fontObj => {
        console.log(`Registering ${fontObj.family}`);
        onLoadFont(fontObj);
      });
      onClose();
      setFontUrl(""); // optional: clear input
    } catch (e) {
      setError({
        targetUrl: parsedUrl.toString(),
        message: e.message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl p-6">
        <h2 className="text-xl font-semibold text-theme-light-primary dark:text-theme-dark-primary mb-4">
          Add Your Favorite Font
        </h2>
        <div className="flex flex-col relative">
          <div className="absolute -mt-14 right-0">
            <button
              onClick={onClose}
              className="text-black dark:text-white px-4 py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition"
            >
              &times;
            </button>
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-700 dark:text-gray-200 mb-1">
              CSS URL
            </label>
            <input
              type="url"
              placeholder="Paste a link to the stylesheet"
              value={fontUrl}
              onChange={(e) => setFontUrl(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-theme-light-primary dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mb-4 relative">
          <div className="flex gap-1 absolute left-0">
            <input
              type="checkbox"
              value={runFilter}
              onChange={e => setRunFilter(e.target.value)}
              className="form-checkbox h-4 w-4 mt-1 transition duration-150 ease-in-out rounded focus:ring focus:ring-blue-200 dark:focus:ring-blue-400 border-gray-300 dark:border-gray-600"
            />
            <LabelWithTooltip 
              label="Filter Font Faces" 
              tooltip="Filter font faces by URL query parameters"
              className="mt-0.5 p-1 items-center text-xs text-gray-700 dark:text-gray-200"
            />
          </div>
          <IconButton
            onClick={() => handleFetch(runFilter)}
            disabled={loading || !getUrl(fontUrl)}
            label={loading ? "Loading" : "Get Fonts"}
            icon={loading 
              ? <ArrowPathIcon className="h-6 w-4 animate-spin spin-normal" />
              : <ArrowDownTrayIcon className="h-6 w-4" />
            }
          />
        </div>
        {error && <ErrorLabel 
          errorMessage={error.message ?? "Some unknown error occurred"}
          errorSource={error.targetUrl ?? `${location.href}${location.pathname}`}
        />}
      </div>
    </div>
  );
}
