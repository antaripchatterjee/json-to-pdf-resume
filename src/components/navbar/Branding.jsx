import React from 'react'

function Branding() {
  return (
    <div className='flex flex-col mb-4 bg-blue-600 text-white p-4'>
      <h1
        onClick={() => location.reload()}
        className="text-3xl w-fit font-bold cursor-pointer ">
        JSON to PDF Résumé
      </h1>
      <span className='text-[10px] w-fit italic'>
        Write your resume, not format it.
      </span>
    </div>
  )
}

export default Branding