import Unauthorized from '@/components/unauthorized'
import { verifyAndAcceptInvitation } from '@/lib/queries'
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

    return <div>
        {children}
    </div>
}

export default layout