import NavBar from '@/components/site/navigation/navBar'
import React from 'react'

const Clientes = () => {
  return (
    <NavBar>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">Clientes</h1>
        <p className="text-lg text-gray-500">Aquí puedes ver la lista de clientes</p>
      </div>
    </NavBar>
  )
}

export default Clientes