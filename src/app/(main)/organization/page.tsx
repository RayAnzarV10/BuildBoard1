import OrgDetails from '@/components/forms/org-details'
import { getAuthUserDetails, verifyAndAcceptInvitation } from '@/lib/queries'
import { currentUser } from '@clerk/nextjs/server'
import { Plan } from '@prisma/client'
import { redirect } from 'next/navigation'
import React from 'react'
import Image from 'next/image'
import { ModeToggle } from '@/components/global/mode-toggle'
import { UserButton } from '@clerk/nextjs'


//Esto es diferente a lo del tutorial, si algo sale mal despues de esto, revisar esta parte
const Page = async ({
  searchParams,
}: {
  searchParams: { plan: Plan; state: string; code: string }
}) => {
  // Desestructuramos y esperamos los valores de searchParams al inicio
  const { plan, state, code } = await searchParams
  const orgId = await verifyAndAcceptInvitation()
  const user = await getAuthUserDetails()

  if (orgId) {
    if (user?.role === 'ORG_OWNER' || user?.role === 'ORG_ADMIN' || user?.role === 'ORG_USER') {
      if (plan) {
        return redirect(`/organization/${orgId}/billing?plan=${plan}`)
      }
      if (state) {
        const statePath = state.split('__')[0]
        const stateorgId = state.split('___')[1]
        
        if (!stateorgId) {
          return <div>No autorizado</div>
        }
        
        return redirect(`/organization/${stateorgId}/${statePath}?code=${code}`)
      }
      return redirect(`/organization/${orgId}`)
    }
    return <div>No Autorizado</div>
  }

  const authUser = await currentUser()
  
  return (
    <>
      <div className='p-2 flex items-center justify-between fixed shadow-lg top-0 right-0 left-0 z-10 bg-secondary'>
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
        <div className='flex items-center justify-center gap-2'>
          <UserButton/>
          <ModeToggle/>
        </div>
      </div>
      <div className='flex mt-10 justify-center items-center'>
        <div className='max-w-[850px] p-4 rounded-md'>
          <h1 className='text-4xl py-8'>
            Crea el perfil de tu <a className='font-bold'>Empresa</a>
          </h1>
          <OrgDetails data={{ email: authUser?.emailAddresses[0].emailAddress }} />
        </div>
      </div>
    </>
  )
}

export default Page