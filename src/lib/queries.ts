'use server'

import { clerkClient, currentUser } from '@clerk/nextjs/server'
import { db } from './db'
import { redirect } from 'next/navigation'
import { Organization, Plan, Project, ProjectStatus, User, Prisma } from '@prisma/client'
import { number } from 'zod'

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
        },
      },
      Permissions: true,
    },
  })

  return userData
}

// export const saveActivityLogsNotification = async ({
//   orgId,
//   description,
// }: {
//   orgId?: string
//   description: string
// }) => {
//   const authUser = await currentUser()
//   let userData
//   if (!authUser) {
//     const response = await db.user.findFirst({
//       where: {
//         org: {
//         },
//       },
//     })
//     if (response) {
//       userData = response
//     }
//   } else {
//     userData = await db.user.findUnique({
//       where: { email: authUser?.emailAddresses[0].emailAddress },
//     })
//   }

//   if (!userData) {
//     console.log('Could not find a user')
//     return
//   }

//   let foundOrgId = orgId
//   if (!foundOrgId) {
//     }
//   }
//   if (subaccountId) {
//     await db.notification.create({
//       data: {
//         notification: `${userData.name} | ${description}`,
//         user: {
//           connect: {
//             id: userData.id,
//           },
//         },
//         org: {
//           connect: {
//             id: foundOrgId,
//           },
//         },
//         subAccount: {
//           connect: { id: subaccountId },
//         },
//       },
//     })
//   } else {
//     await db.notification.create({
//       data: {
//         notification: `${userData.name} | ${description}`,
//         user: {
//           connect: {
//             id: userData.id,
//           },
//         },
//         org: {
//           connect: {
//             id: foundOrgId,
//           },
//         },
//       },
//     })
//   }
// }

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

    if (userDetails) {
      //Si esto no funciona, intenta quitar el primer await
      await (await clerkClient()).users.updateUserMetadata(user.id, {
        privateMetadata: {
          role: userDetails.role || 'ORG_USER',
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
      role: newUser.role || 'ORG_USER',
    }
  })

  await (await clerkClient()).users.updateUserMetadata(user.id, {
    privateMetadata: {
      role: newUser.role || 'ORG_USER',
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
      }
    })
    return orgDetails
  } catch (error) {
    console.log(error)
  }
}

export const nextNumber = async (orgId: string) => {
  const response = await db.project.findFirst({
    where: { orgId },
    orderBy: {
      number: 'desc',
    },
    select: { number: true },
  });

  return response ? response.number + 1 : 1;
}

interface LocationCoordinates {
  lat: string | number;
  lng: string | number;
}

export const createProject = async (project: Project & { det_location?: LocationCoordinates }) => {
  try {
    const response = await db.project.create({
      data: {
        number: project.number,
        name: project.name,
        orgId: project.orgId,
        status: project.status,
        location: project.location,
        det_location: project.det_location ? {
          lat: Number(project.det_location.lat),
          lng: Number(project.det_location.lng)
        } : Prisma.JsonNull,
        description: project.description,
        est_completion: project.est_completion,
        budget: project.budget,
      }
    });
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

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

export const getOrganizationIncome = async (orgId: string) => {
  return await db.income.findMany({
    where: { orgId }
  });
};

export const getProjectIncome = async (orgId: string, projectId: string) => {
  return await db.income.findMany({
    where: { 
      orgId,
      projectId 
    }
  });
};

export const getProjectWhere = async (orgId: string, status: ProjectStatus) => {
  return await db.project.findMany({
    where: {
      orgId: orgId,
      status: status
    }
  });
}

export const getAllProjects = async (orgId: string) => {
  return await db.project.findMany({
    where: { orgId }
  });
}

export const getProject = async (orgId: string, projectId: string) => {
  return await db.project.findUnique({
    where: {
      id: projectId,
      orgId: orgId
    }
  });
}

export const createClient = async (data: any) => {
  return await db.client.create({
    data
  });
};

export const getClient = async (orgId: string, clientId: string) => {
  return await db.client.findUnique({
    where: {
      id: clientId,
      orgId
    }
  });
}

export const getClients = async (orgId: string) => {
  return await db.client.findMany({
    where: { orgId },
    orderBy: {
      name: 'asc'
    }
  });
};

export const assignClientToProject = async (projectId: string, clientId: string) => {
  return await db.project.update({
    where: { id: projectId },
    data: { 
      clientId: clientId,
      updatedAt: new Date()
    }
  });
};

export const removeClientFromProject = async (projectId: string) => {
  return await db.project.update({
    where: { id: projectId },
    data: { 
      clientId: null,
      updatedAt: new Date()
    }
  });
};