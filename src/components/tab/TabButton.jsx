import React from 'react'

function TabButton({isLast, label}) {
  return (
    <button
      onClick={() => 0}
      style={{
        clipPath: isLast ? "polygon(10% 0%, 100% 0%, 100% 100%, 0% 100%)" : "polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)"
      }}
      className="flex justify-start px-4 py-2 w-40 -ml-3.5 rounded font-medium text-sm relative bg-theme-light-primary dark:bg-theme-dark-primary hover:bg-gray-600 text-whitesmoke shadow-lg"
    >
      <span
        onClick={() => alert('he')}
        className='font-bold absolute right-5 top-1 hover:scale-150'>
        &times;
      </span>
      <span className='inline-block truncate text-[12px] max-w-3/4'>
        {label}
      </span>
    </button>
  )
}

export default TabButton