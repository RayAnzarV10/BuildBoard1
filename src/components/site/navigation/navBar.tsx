import { ModeToggle } from '@/components/global/mode-toggle'
import { Notifications } from '@/components/sidebar/notifications'
import { AppSidebar } from '@/components/sidebar/sidebar'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { useIsLarge } from '@/hooks/use-mobile'
import { getAuthUserDetails, getNotificationAndUser } from '@/lib/queries'
import { UserButton } from '@clerk/nextjs'
import { Client, currentUser } from '@clerk/nextjs/server'
import React from 'react'
import { ReactNode } from 'react';
import { ClientSideWrapper } from './client-wrapper'

const NavBar = async ({ children }: { children: ReactNode }) => {

  const user = await getAuthUserDetails()
  const userClerk = await currentUser()
  if (!user) return null
  if (!user.org) return 
    
  let logo = user.org.logo || '/assets/logoBuildBoard.svg'
  let orgName = user.org.name || 'BuildBoard'
  let orgId = user.org.id || ''
  let orgEmail = user.org.email || ''
  let userName = user.name || ''
  let userEmail = user.email || ''
  let userAvatar = userClerk?.imageUrl || 'circle-user'
  let allNoti: any = []
  const notifications = await getNotificationAndUser(orgId)
  if (notifications) allNoti = notifications

  return (
  <ClientSideWrapper>
    <AppSidebar user={ user } orgName={ orgName } orgId={ orgId } orgLogo={ logo } orgEmail={ orgEmail } userName={ userName } userEmail={ userEmail } userAvatar={ userAvatar } />
      <SidebarInset>  
        <nav className='sticky z-10 top-0 flex items-center gap-2 p-4'>
          <div className='p-2 flex w-full rounded-md items-center justify-between shadow-lg top-0 right-0 left-0 z-10 bg-secondary' >
            <aside className='flex items-center gap-2'>
              <SidebarTrigger/>
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={ logo } />
              </Avatar>
              <span className='text-xl font-bold p-1'>
                {orgName}
              </span>
            </aside>
            <aside className='flex gap-2 items-center pr-2'>
              <UserButton />
              <Notifications notifications={ allNoti }/>
              <ModeToggle />
            </aside>
          </div>
        </nav>
        {children}
      </SidebarInset>
    </ClientSideWrapper>
);
}

export default NavBar