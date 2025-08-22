import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { PlusIcon } from '@heroicons/react/24/outline';

import TabButton from './TabButton';
import TabMenu from './TabMenu';

import useTabStore from '../stores/tab.store';

function TabButtons() {
  const navigate = useNavigate();
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
    <div className="flex items-start w-full overflow-x-scroll scrollbar-hidden">
      {[...tabs].map(([key, value]) =>
        <TabButton
          key={`tab-key-${key}`}
          label={value}
          tabIndex={key}
          onClick={() => navigate(`/tabs/${key}`)}
        />)
      }

      <div ref={buttonRef}>
        <button
          onContextMenu={toggleMenu}
          onClick={() => {
            const newTabIndex = addTab();
            navigate(`/tabs/${newTabIndex}`)
          }}
          className="px-2 py-2 shadow-lg dark:bg-slate-800 bg-zinc-300 dark:text-gray-50 text-gray-800 hover:bg-zinc-200 hover:dark:bg-slate-700"
        >
          <PlusIcon className="h-[20.8px] w-[20.8px]" />
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