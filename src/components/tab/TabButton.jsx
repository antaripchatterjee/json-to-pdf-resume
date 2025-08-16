import React from 'react'
import clsx from 'clsx'

function TabButton({isFirst, isLast, label}) {
  return (
    <button
      onClick={() => console.log(label)}
      title={label}
      className="flex-shrink-0 flex justify-start px-4 py-2 w-40 rounded font-medium text-sm relative bg-theme-light-primary dark:bg-theme-dark-primary hover:bg-gray-600 text-whitesmoke shadow-lg tab-btn"
    >
      <span
        onClick={() => alert('he')}
        className='font-bold absolute right-4 top-0.5 hidden hover:scale-150'>
        &times;
      </span>
      <span className='inline-block truncate text-[12px] max-w-3/4'>
        {label}
      </span>
    </button>
  )
}

export default TabButton