import React from 'react'

const AuthLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className='h-full flex items-center justify-center [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]'>{children}</div>
  )
}

export default AuthLayout