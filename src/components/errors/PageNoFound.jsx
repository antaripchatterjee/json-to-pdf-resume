// create and export a 404 Page not found react functional component
import React, { useEffect, useRef } from 'react';

function PageNoFound() {
  const errorRef = useRef(null);
  useEffect(() => {
    if(errorRef.current) {
      console.log('Okay');
      errorRef.current = null;
    } else {
      errorRef.current = 'bumpa'
    }
  })
  return (
    <div className='h-full flex justify-center items-center'>
      <h1 className='text-3xl font-bold text-gray-900'>
        404 - Page Not Found
      </h1>
    </div>
  )
}

export default PageNoFound;