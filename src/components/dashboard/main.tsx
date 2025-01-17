'use client'

import React from 'react'
import Projects from './search-projects'

const Dashboard = () => {
  return (
    <div className='flex-1 flex flex-col md:flex-row gap-2 rounded-md m-4 mt-[-2]'>
      <Projects />
      <div className='bg-green-500 rounded-md w-auto flex flex-1 h-full'>
        Hola
      </div>
    </div>
  )
}

export default Dashboard

