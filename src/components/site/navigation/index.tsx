import { ModeToggle } from '@/components/global/mode-toggle'
import { Button } from '@/components/ui/button'
import { UserButton, useUser } from '@clerk/nextjs'
import { currentUser, User } from '@clerk/nextjs/server'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Props = {
    user?:null | User
}

const Navigation = async( { user } : Props) => {

  return <div className='p-2 flex items-center justify-between fixed shadow-lg top-0 right-0 left-0 z-10 bg-secondary'>
    <aside className='flex items-center gap-2'>
        <Image 
            src={'./assets/logoBuildBoard.svg'} 
            alt='logo' 
            width={35} 
            height={35} 
        />
        <span className='text-lg font-bold'>
            BuildBoard.
        </span>
    </aside>
    <nav className='hidden md:block absolute left-[50%] top-[50%] transform translate-x-[-50%] translate-y-[-50%]'>
        <ul className='flex items-center justify-center gap-8'>
            <Link className='text-sm font-bold hover:transition duration-300 relative group' href={'#'}>
                Precios
                <span className='absolute left-1/2 bottom-0 w-0 h-0.5 bg-primary group-hover:w-[100%] transition-all duration-300 transform -translate-x-1/2'/>
            </Link>
            <Link className='text-sm font-bold hover:transition duration-300 relative group' href={'#'}>
                Características
                <span className='absolute left-1/2 bottom-0 w-0 h-0.5 bg-primary group-hover:w-[100%] transition-all duration-300 transform -translate-x-1/2'/>
            </Link>
            <Link className='text-sm font-bold hover:transition duration-300 relative group' href={'#'}>
                Soporte
                <span className='absolute left-1/2 bottom-0 w-0 h-0.5 bg-primary group-hover:w-[100%] transition-all duration-300 transform -translate-x-1/2'/>
            </Link>
        </ul>
    </nav>
    <aside className='flex gap-2 items-center'>
        <Link href={"/organization"}>
            {
                await currentUser()? 
                    <Button variant='outline' size='sm' className="font-bold block hover:transition duration-300 relative group">
                        Dashboard
                    <span className="absolute left-1/2 bottom-0 w-0 h-0.5 bg-blue-600 group-hover:w-[100%] transition-all duration-300 transform -translate-x-1/2"></span>
                    </Button> 
                    :
                    <Button variant='default' size='sm' className="font-bold block hover:transition duration-300 relative group">
                        Iniciar Sesión
                    </Button>
            }
        </Link>
        <UserButton />
        <ModeToggle/>
    </aside>
  </div>
}

export default Navigation