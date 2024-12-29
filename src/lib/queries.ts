'use server'

import { clerkClient, currentUser } from '@clerk/nextjs/server'
import { db } from './db'
import { redirect } from 'next/navigation'
import { Organization, Plan, User } from '@prisma/client'

export const getAuthUserDetails = async () => {
  const user = await currentUser()
  if (!user) {
    return
  }

  const userData = await db.user.findUnique({
    where: {
      email: user.emailAddresses[0].emailAddress,
    },
    include: {
      org: {
        include: {
          SidebarOption: true,
          SubAccount: {
            include: {
              SidebarOption: true,
            },
          },
        },
      },
      Permissions: true,
    },
  })

  return userData
}

export const saveActivityLogsNotification = async ({
  orgId,
  description,
  subaccountId,
}: {
  orgId?: string
  description: string
  subaccountId?: string
}) => {
  const authUser = await currentUser()
  let userData
  if (!authUser) {
    const response = await db.user.findFirst({
      where: {
        org: {
          SubAccount: {
            some: { id: subaccountId },
          },
        },
      },
    })
    if (response) {
      userData = response
    }
  } else {
    userData = await db.user.findUnique({
      where: { email: authUser?.emailAddresses[0].emailAddress },
    })
  }

  if (!userData) {
    console.log('Could not find a user')
    return
  }

  let foundOrgId = orgId
  if (!foundOrgId) {
    if (!subaccountId) {
      throw new Error(
        'You need to provide at least an organization Id or subaccount Id'
      )
    }
    const response = await db.subAccount.findUnique({
      where: { id: subaccountId },
    })
    if (response) foundOrgId = response.orgId
  }
  if (subaccountId) {
    await db.notification.create({
      data: {
        notification: `${userData.name} | ${description}`,
        user: {
          connect: {
            id: userData.id,
          },
        },
        org: {
          connect: {
            id: foundOrgId,
          },
        },
        subAccount: {
          connect: { id: subaccountId },
        },
      },
    })
  } else {
    await db.notification.create({
      data: {
        notification: `${userData.name} | ${description}`,
        user: {
          connect: {
            id: userData.id,
          },
        },
        org: {
          connect: {
            id: foundOrgId,
          },
        },
      },
    })
  }
}

export const createTeamUser = async (orgId: string, user: User) => {
  if (user.role === 'ORG_OWNER') return null
  const response = await db.user.create({ data: { ...user } })
  return response
}

export const verifyAndAcceptInvitation = async () => {
  const user = await currentUser()
  if (!user) return redirect('/sign-in')
  const invitationExists = await db.invitation.findUnique({
    where: {
      email: user.emailAddresses[0].emailAddress,
      status: 'PENDING',
    },
  })

  if (invitationExists) {
    const userDetails = await createTeamUser(invitationExists.orgId, {
      email: invitationExists.email,
      orgId: invitationExists.orgId,
      avatarUrl: user.imageUrl,
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      role: invitationExists.role,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    await saveActivityLogsNotification({
      orgId: invitationExists?.orgId,
      description: `Joined`,
      subaccountId: undefined,
    })

    if (userDetails) {
      //Si esto no funciona, intenta quitar el primer await
      await (await clerkClient()).users.updateUserMetadata(user.id, {
        privateMetadata: {
          role: userDetails.role || 'SUBACCOUNT_USER',
        },
      })

      await db.invitation.delete({
        where: { email: userDetails.email },
      })

      return userDetails.orgId
    } else return null
  } else {
    const organ = await db.user.findUnique({
      where: {
        email: user.emailAddresses[0].emailAddress,
      },
    })
    return organ ? organ.orgId : null
  }
}

// export const updateOrgDetails = async (
//   orgId: string,
//   orgDetails: Partial<Organization>
// ) => {
//   const response = await db.organization.update({
//     where: { id: orgId },
//     data: { ...orgDetails },
//   })
//   return response
// }

export const deleteOrg = async (orgId: string) => {
  const response = await db.organization.delete({ where: { id: orgId } })
  return response
}

export const initUser = async (newUser: Partial<User>) => {
  const user = await currentUser()
  if (!user) return 

  const userData = await db.user.upsert({
    where:{
      email: user.emailAddresses[0].emailAddress,
    },
    update: newUser,
    create: {
      id: user.id,
      email: user.emailAddresses[0].emailAddress,
      name: `${user.firstName} ${user.lastName}`,
      avatarUrl: user.imageUrl,
      role: newUser.role || 'SUBACCOUNT_USER',
    }
  })

  await (await clerkClient()).users.updateUserMetadata(user.id, {
    privateMetadata: {
      role: newUser.role || 'SUBACCOUNT_USER',
    },
  })
  return userData
}

export const upsertOrg = async (organization: Organization, price?: Plan) => {
  if (!organization.email) return null
  try {
    const orgDetails = await db.organization.upsert({
      where: {
        id: organization.id,
      },
      update: organization,
      create: {
        users: {
          connect: { email: organization.email },
        },
        ...organization,
        SidebarOption: {
          create: [
            {
              name: 'Dashboard',
              icon: 'category',
              link: `/organization/${organization.id}`,
            },
            {
              name: 'Launchpad',
              icon: 'clipboardIcon',
              link: `/organization/${organization.id}/launchpad`,
            },
            {
              name: 'Billing',
              icon: 'payment',
              link: `/organization/${organization.id}/billing`,
            },
            {
              name: 'Settings',
              icon: 'settings',
              link: `/organization/${organization.id}/settings`,
            },
            {
              name: 'Sub Accounts',
              icon: 'person',
              link: `/organization/${organization.id}/all-subaccounts`,
            },
            {
              name: 'Team',
              icon: 'shield',
              link: `/organization/${organization.id}/team`,
            },
          ] 
        }
      }
    })
    return orgDetails
  } catch (error) {
    console.log(error)
  }
}

export const getNotificationAndUser = async (orgId: string) => {
  try {
    const response = await db.notification.findMany({
      where: {orgId},
      include: {user: true},
      orderBy: {
        createdAt: 'desc'
      }
    })
    return response
  } catch (error) {
    console.log(error)
  }
}