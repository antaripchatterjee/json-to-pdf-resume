// create and export a 404 Page not found react functional component
import React from 'react';

function PageNoFound() {
  return (
    <div className='h-full flex justify-center items-center'>
      <h1 className='text-3xl font-bold text-gray-900'>
        404 - Page Not Found
      </h1>
    </div>
  )
}

export default PageNoFound;