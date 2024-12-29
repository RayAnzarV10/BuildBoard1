import { getAuthUserDetails } from '@/lib/queries'
import React from 'react'
import MenuOptions from './menu-options'

type Props = {
    id: string
    type: 'organization' | 'subaccount'
}

const Sidebar = async ({ id, type }:Props) => {
  const user = await getAuthUserDetails()
  if (!user) return null

  if (!user.org) return 

  const details = 
    type === 'organization' 
      ? user?.org
      : user?.org.SubAccount.find((subaccount) => subaccount.id === id)

    const isWhiteLabeledOrg = user.org.whiteLabel
    if (!details) return 

    let sideBarLogo = user.org.logo || '/assets/logoBuildBoard.svg'

    if (!isWhiteLabeledOrg) {
        if (type === 'subaccount') {
            sideBarLogo = user?.org.SubAccount.find((subaccount) => subaccount.id === id)?.subAccountLogo || user.org.logo
        }
    }

    const sidebarOpt = 
        type === 'organization'
            ? user.org.SidebarOption || []  
            : user.org.SubAccount.find((subaccount) => subaccount.id === id)?.SidebarOption || []

    const subaccounts = 
        user.org.SubAccount.filter((subaccount) => user.Permissions.find(
            (permission) => permission.subAccountId === subaccount.id && permission.access
        ))

    return (
        <>
            <MenuOptions defaultOpen={true} subaccounts={subaccounts} sidebarOpt={sidebarOpt} sidebarLogo={sideBarLogo} details={details} user={undefined} id={id}/>
            <MenuOptions subaccounts={subaccounts} sidebarOpt={sidebarOpt} sidebarLogo={sideBarLogo} details={details} user={undefined} id={id}/>
        </>
    )
}

export default Sidebar