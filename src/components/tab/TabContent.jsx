import React from 'react'

function TabContent({ children, title }) {
  return (
    <div className='h-full'>
      <div className='flex p-0.5 justify-center text-center'>
        <span className='text-zinc-500 dark:text-whitesmoke'>{title}</span>
      </div>
      {children}
    </div>
  )
}

export default TabContent;