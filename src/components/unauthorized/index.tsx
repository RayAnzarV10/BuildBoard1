import Link from 'next/link'
import React from 'react'

type Props = {}

const Unauthorized = (props: Props) => {
  return (
    <div className="p-4 text-center h-screen w-screen flex justify-center items-center flex-col">
      <h1 className="text-3xl md:text-6xl">Acceso denegado</h1>
      <p className='mt-2'>Por favor contacta soporte o con el propietario de su organización para obtener acceso</p>
      <Link
        href="/"
        className="mt-4 bg-primary p-2 rounded-md text-white"
      >
        Regresar
      </Link>
    </div>
  )
}

export default Unauthorized