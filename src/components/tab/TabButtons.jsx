import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { PlusIcon, DocumentMagnifyingGlassIcon } from '@heroicons/react/24/outline';

import TabButton from './TabButton';
import TabMenu from './TabMenu';

import useTabStore from '../stores/tab.store';

function TabButtons() {
  const navigate = useNavigate();
  const { tabs, addTab } = useTabStore();
  const [ tabAdded, setTabAdded] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false)
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 })
  const tabContainerRef = useRef(null);
  const buttonRef = useRef(null);

  const toggleMenu = (e) => {
    e.preventDefault();
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setMenuPos({ x: rect.right, y: rect.top });
    setMenuOpen((prev) => !prev);
  }

  useEffect(() => {
    if(tabAdded && tabContainerRef.current) {
      tabContainerRef.current?.scrollTo({ left: tabContainerRef.current.scrollWidth, behavior: 'smooth' });
      setTabAdded(false);
    }
  }, [tabAdded])

  return (
    <div className='flex w-full p-0 m-0'>
      <div
        ref={tabContainerRef}
        className="flex items-start w-full overflow-x-scroll scrollbar-hidden"
      >
        {[...tabs].map(([key, value]) =>
          <TabButton
            key={`tab-key-${key}`}
            label={value}
            tabIndex={key}
            onClick={() => navigate(`/tabs/${key}`)}
          />
        )}
      </div>
      <div className='flex gap-0 p-0 m-0 justify-self-end'>
        <div ref={buttonRef}>
          <button
            onContextMenu={toggleMenu}
            onClick={() => {
              const newTabIndex = addTab();
              navigate(`/tabs/${newTabIndex}`);
              setTabAdded(true);
            }}
            className="px-2 py-2 dark:bg-slate-800 bg-zinc-300 dark:text-gray-50 text-gray-800 hover:bg-zinc-200 hover:dark:bg-slate-700"
          >
            <PlusIcon className="h-[20.8px] w-[20.8px]" />
          </button>
        </div>

        <TabMenu
          isOpen={menuOpen}
          menuPos={menuPos}
          afterTabAdded={() => setTabAdded(true)}
          onClose={() => setMenuOpen(false)}
        />
        <button
          onContextMenu={toggleMenu}
          onClick={() => { alert("TODO: search globally")}}
          className="px-2 py-2 dark:bg-slate-800 bg-zinc-300 dark:text-gray-50 text-gray-800 hover:bg-zinc-200 hover:dark:bg-slate-700"
        >
          <DocumentMagnifyingGlassIcon className="h-[20.8px] w-[20.8px]" />
        </button>
      </div>

    </div>
  )
}

export default TabButtons;