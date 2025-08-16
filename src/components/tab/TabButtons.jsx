import { PlusIcon } from '@heroicons/react/24/outline'
import React, { useState, useRef, useEffect } from 'react'
import TabButton from './TabButton'

function TabButtons() {
  const tabs = [
    'index.html',
    'index.js',
    'index.js',
    'index.js',
    'index.js',
    'index.js',
    'index.js',
    'index.js',
    'index.js',
    'index.js',
    'index.js',
    'index.js',
    'index.js',
    'index.js',
    'index.js',
    'index.js',
    'index.js',
    'index.js',
    'index.js',
    'index.js',
    'index.js',
    'index.js',
    'index.js',
    'index.js',
    'index.js',
    'index.js',
    'index.js',
    'index.js',
    'index.js',
    'index.js',
    'index.js',
    'index.js',
    'index.js',
    'index.js',
    'index.js',
    'index.js',
    'index.js',
    'index.js',
    'index.js',
    'index.js',
    'index.js',
    'index.js',
    'index.js',
    'index.js',
    'index.js',
    'index.js',
    'index.js',
    'index.js',
    'index.js',
    'index.js',
    'index.js',
    'index.js',
    'index.js',
    'index.js',
    'index.js',
    'index.js',
    'index.css'
  ]

  const [menuOpen, setMenuOpen] = useState(false)
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 })
  const buttonRef = useRef(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (buttonRef.current && !buttonRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const toggleMenu = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setMenuPos({ x: rect.right, y: rect.top });
    setMenuOpen((prev) => !prev);
  }

  return (
    <div className="flex items-start border-gray-300 absolute -bottom-8 -left-0.5 w-full overflow-x-auto scrollbar-thin">
      {tabs.map((tabLabel, i) =>
        <TabButton
          key={i}
          label={tabLabel.replace('%d', i)}
        />)
      }

      {/* + Button */}
      <div ref={buttonRef}>
        <button
          onContextMenu={toggleMenu}
          onClick={() => 0}
          className="px-2 py-2 rounded-full ml-1 bg-theme-light-primary dark:bg-theme-dark-primary hover:bg-gray-600 text-whitesmoke shadow-lg"
        >
          <PlusIcon className="h-[17px] w-[17px]" />
        </button>
      </div>

      {/* Context Menu rendered outside flow */}
      {menuOpen && (
        <div
          className="fixed z-50 w-44 rounded-lg shadow-lg border
                     bg-white border-gray-200 text-gray-800
                     dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
          style={{ top: `${menuPos.y - 128}px`, left: `${Math.max(20, menuPos.x - 176)}px` }}
        // 176 = menu width (w-44), adjust so it aligns with button
        >
          <button
            className="block w-full text-left px-4 py-2 text-sm 
                       hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => {
              console.log("New Resume clicked")
              setMenuOpen(false)
            }}
          >
            New Resume
          </button>

          <hr className="my-1 border-gray-300 dark:border-gray-600" />

          <button
            className="block w-full text-left px-4 py-2 text-sm 
                       hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => {
              console.log("Settings clicked")
              setMenuOpen(false)
            }}
          >
            Settings
          </button>

          <button
            className="block w-full text-left px-4 py-2 text-sm 
                       hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => {
              console.log("Help clicked")
              setMenuOpen(false)
            }}
          >
            Help
          </button>
        </div>
      )}
    </div>
  )
}

export default TabButtons;