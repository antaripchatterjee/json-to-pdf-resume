import React from 'react'
import TabButtons from './TabButtons'

function TabContainer() {
  return (
    <div className="mx-auto h-full relative">
      <div className="p-4 h-full">
        <div className="text-gray-700">
          Hello World
        </div>
      </div>
      <TabButtons />
    </div>
  )
}

export default TabContainer