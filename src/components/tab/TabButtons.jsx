import { PlusIcon } from '@heroicons/react/24/outline'
import React from 'react'
import TabButton from './TabButton'

function TabButtons() {
  const tabs = [
    'Tab 1 for index.html',
    'Tab 2 for index.js',
    'Tab 3 for index.css'
  ]
  return (
    <div className="flex items-start border-gray-300 absolute -bottom-8 -left-0.5 w-full overflow-x-auto scrollbar-thin">
      <button
        onClick={() => 0}
        style={{
          clipPath: "polygon(0% 0%, 100% 0%, 90% 100%, 0% 100%)"
        }}
        className="flex justify-start px-4 py-2 w-40 rounded font-medium text-sm relative bg-theme-light-primary dark:bg-theme-dark-primary hover:bg-gray-600 text-whitesmoke shadow-lg"
      >
        <span className='inline-block truncate text-[12px] max-w-3/4'>
          Some Big Text of The ebdks
        </span>
      </button>
      {tabs.map((tabLabel, i) => 
        <TabButton 
          key={i} 
          isLast={i === tabs.length-1} 
          label={tabLabel}
        />)
      }
      <button
        onClick={() => 0}
        className="px-2 py-2 rounded-full ml-1 bg-theme-light-primary dark:bg-theme-dark-primary hover:bg-gray-600 text-whitesmoke shadow-lg"
      >
        <PlusIcon className='h-[17px] w-[17px]' />
      </button>
    </div>
  )
}

export default TabButtons