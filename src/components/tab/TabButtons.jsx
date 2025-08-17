import React, { useState, useRef } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

import TabButton from './TabButton';
import TabMenu from './TabMenu';

import useTabStore from '../stores/tab.store';

function TabButtons() {
  const { tabs, addTab } = useTabStore();

  const [menuOpen, setMenuOpen] = useState(false)
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 })
  const buttonRef = useRef(null);

  const toggleMenu = (e) => {
    e.preventDefault();
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setMenuPos({ x: rect.right, y: rect.top });
    setMenuOpen((prev) => !prev);
  }

  return (
    <div className="flex items-start border-gray-300 absolute -bottom-8 -left-0.5 w-full overflow-x-auto scrollbar-thin">
      {[...tabs].map(([key, value]) =>
        <TabButton
          key={`tab-key-${key}`}
          label={value}
          tabIndex={key}
        />)
      }

      <div ref={buttonRef}>
        <button
          onContextMenu={toggleMenu}
          onClick={() => addTab()}
          className="px-2 py-2 rounded-full ml-1 bg-theme-light-primary dark:bg-theme-dark-primary hover:bg-gray-600 text-whitesmoke shadow-lg"
        >
          <PlusIcon className="h-[22px] w-[22px]" />
        </button>
      </div>

      <TabMenu 
        isOpen={menuOpen}
        menuPos={menuPos}
        onClose={() => setMenuOpen(false)}
      />
    </div>
  )
}

export default TabButtons;