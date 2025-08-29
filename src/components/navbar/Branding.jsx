import React from 'react'

function Branding() {
  return (
    <div className='flex flex-col mb-4'>
      <h1
        onClick={() => location.reload()}
        className="text-3xl font-bold cursor-pointer text-theme-light-primary dark:text-theme-dark-primary">
        JSON to PDF Résumé
      </h1>
      <span className='text-[10px] ml-40 text-theme-light-primary dark:text-theme-dark-primary italic'>
        Write your resume, not format it.
      </span>
    </div>
  )
}

export default Branding