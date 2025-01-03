import Sidebar from '@/components/sidebar'
import Unauthorized from '@/components/unauthorized'
import { getNotificationAndUser, verifyAndAcceptInvitation } from '@/lib/queries'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'


//Esto lo cambió codemods, pero no estoy seguro de que sea correcto
type Props = {
    children: React.ReactNode
    params: Promise<{ orgId: string }>
}

const layout = async (props: Props) => {
    const params = await props.params;

    const {
        children
    } = props;

    const orgId = await verifyAndAcceptInvitation()
    const user = await currentUser()

    if (!user) {
        return redirect('/')
    }

    if (!orgId) {
        return redirect('/organization')
    }

    if (
        user.privateMetadata.role !== 'ORG_OWNER' &&
        user.privateMetadata.role !== 'ORG_ADMIN'
    )

    return <Unauthorized/>

    let allNoti: any = []
    const notifications = await getNotificationAndUser(orgId)
    if ( notifications ) allNoti = notifications

    return <div className='h-screen overflow-hidden'>
        <Sidebar 
            id={params.orgId}
            type='organization'
        />
        <div className='md:pl-[300px]'>{children}</div>
    </div>
}

export default layout