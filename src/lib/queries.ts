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

export const createProject = async (project: Omit<Project, 'totalIncome' | 'totalExpense'> & { det_location?: LocationCoordinates }) => {
  try {
    const response = await db.project.create({
      data: {
        ...project,
        totalIncome: 0,
        totalExpense: 0,
      }
    });

    return {
      ...response,
      budget: Number(response.budget),
      totalIncome: Number(response.totalIncome),
      totalExpense: Number(response.totalExpense)
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateProject = async (project: Partial<Project> & { det_location?: LocationCoordinates }) => {
  try {
    const response = await db.project.update({
      where: {
        id: project.id
      },
      data: {
        name: project.name,
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

export const getOrganizationIncomeTransactions = async (orgId: string) => {
  const transactions = await db.transaction.findMany({
    where: { 
      type: 'INCOME',
      orgId: orgId,
    }
  });

  return transactions.map(transaction => ({
    ...transaction,
    amount: Number(transaction.amount),
    exchangeRate: Number(transaction.exchangeRate)
  }));
};

export const getOrganizationTotalIncome = async (orgId: string) => {
  const result = await db.project.aggregate({
    where: {
      orgId
    },
    _sum: {
      totalIncome: true
    }
  });

  return Number(result._sum.totalIncome) || 0;
};

export const getProjectWhere = async (orgId: string, status: ProjectStatus) => {
  const projects = await db.project.findMany({
    where: {
      orgId: orgId,
      status: status
    }
  });

  return projects.map(project => ({
    ...project,
    budget: Number(project.budget),
    totalIncome: Number(project.totalIncome),
    totalExpense: Number(project.totalExpense)
  }));
};

export const getAllProjects = async (orgId: string) => {
  const projects = await db.project.findMany({
    where: {
      orgId,
    },
    include: {
      transactions: true,
    }
  });

  return projects.map(project => ({
    ...project,
    budget: Number(project.budget),
    totalIncome: Number(project.totalIncome),
    totalExpense: Number(project.totalExpense),
    transactions: project.transactions.map(transaction => ({
      ...transaction,
      amount: Number(transaction.amount),
      exchangeRate: Number(transaction.exchangeRate)
    }))
  }));
};

export const getProject = async (orgId: string, projectId: string) => {
  const project = await db.project.findUnique({
    where: {
      id: projectId,
      orgId: orgId
    },
    include: {
      transactions: true,
    }
  });

  if (!project) return null;

  return {
    ...project,
    budget: Number(project.budget),
    totalIncome: Number(project.totalIncome),
    totalExpense: Number(project.totalExpense),
    transactions: project.transactions.map(transaction => ({
      ...transaction,
      amount: Number(transaction.amount),
      exchangeRate: Number(transaction.exchangeRate)
    }))
  };
};

export const createParty = async (data: any) => {
  return await db.party.create({
    data
  });
};

export const getClient = async (orgId: string, clientId: string) => {
  const client = await db.party.findUnique({
    where: {
      type: 'CLIENT',
      id: clientId,
      orgId,
    },
    include: {
      transactions: true, // Incluimos las transacciones
    }
  });

  if (!client) return null;

  return {
    ...client,
    transactions: client.transactions.map(transaction => ({
    ...transaction,
    amount: Number(transaction.amount),
    exchangeRate: Number(transaction.exchangeRate)
    }))
  };
};

export const getClients = async (orgId: string) => {
  const clients = await db.party.findMany({
    where: { 
      type: 'CLIENT',
      orgId: orgId,
    },
    orderBy: {
      name: 'asc'
    }
  });

  return clients
};

export const assignClientToProject = async (projectId: string, clientId: string) => {
  const updatedProject = await db.project.update({
    where: { id: projectId },
    data: { 
      clientId: clientId,
      updatedAt: new Date()
    },
    include: {
      // Assuming you might want to include related decimal fields
      transactions: true
    }
  });
  
  // Process any decimal fields in the returned project data
  return {
    ...updatedProject,
    totalIncome: Number(updatedProject.totalIncome),
    totalExpense: Number(updatedProject.totalExpense),
    budget: Number(updatedProject.budget),
    // Process transactions if included
    transactions: updatedProject.transactions?.map(tx => ({
      ...tx,
      amount: Number(tx.amount),
      exchangeRate: tx.exchangeRate ? Number(tx.exchangeRate) : null
    }))
  };
};

export const removeClientFromProject = async (projectId: string) => {
  const updatedProject = await db.project.update({
    where: { id: projectId },
    data: { 
      clientId: null,
      updatedAt: new Date()
    },
    include: {
      // Assuming you might want to include related decimal fields
      transactions: true
    }
  });
  
  // Process any decimal fields in the returned project data
  return {
    ...updatedProject,
    totalIncome: Number(updatedProject.totalIncome),
    totalExpense: Number(updatedProject.totalExpense),
    budget: Number(updatedProject.budget),
    // Process transactions if included
    transactions: updatedProject.transactions?.map(tx => ({
      ...tx,
      amount: Number(tx.amount),
      exchangeRate: tx.exchangeRate ? Number(tx.exchangeRate) : null
    }))
  };
};

export const getProjectIncome = async (orgId: string, projectId: string) => {
  return await db.transaction.findMany({
    where: {
      orgId,
      projectId,
      type: 'INCOME'
    },
  });
}

export const getProjectTotals = async (projectId: string) => {
  const totals = await db.project.findUnique({
    where: { id: projectId },
    select: {
      totalIncome: true,
      totalExpense: true
    }
  });

  if (!totals) return null;

  return {
    totalIncome: Number(totals.totalIncome),
    totalExpense: Number(totals.totalExpense)
  };
};

export const getProjectExpenses = async (orgId: string, projectId: string) => {
  const expenses = await db.transaction.findMany({
    where: {
      orgId,
      projectId,
      type: 'EXPENSE'
    },
  });

  return expenses.map(expense => ({
    ...expense,
    amount: Number(expense.amount)
  }));
};

export const getProjectTransactions = async (orgId: string, projectId: string) => {
  const transactions = await db.transaction.findMany({
    where: {
      orgId,
      projectId,
    },
    select: {
      amount: true,
      type: true,
    }
  });

  return transactions.map(transaction => ({
    ...transaction,
    amount: Number(transaction.amount)
  }));
};

export const transaction = async (orgId: string, transactionId: string ) => {
  const result = await db.transaction.findUnique({
    where: { 
      id: transactionId,
      orgId: orgId 
    },
  });

  if (!result) return null;

  return {
    ...result,
    amount: Number(result.amount),
    exchangeRate: Number(result.exchangeRate)
  };
};

export const attachment = async (fileData: any, transactionId: string) => {
  return await db.mediaAttachment.create({
    data: {
      ...fileData,
      transactionId: transactionId,
    },
  });
}

export const createTransaction = async (transaction: any) => {
  return await db.$transaction(async (tx) => {
    // Crear la transacción
    const newTransaction = await tx.transaction.create({
      data: transaction
    });

    // Actualizar el total correspondiente en el proyecto
    await tx.project.update({
      where: { 
        id: transaction.projectId 
      },
      data: transaction.type === 'INCOME' 
        ? { totalIncome: { increment: transaction.amount } }
        : { totalExpense: { increment: transaction.amount } }
    });

    return {
      ...newTransaction,
      amount: Number(newTransaction.amount),
      exchangeRate: Number(newTransaction.exchangeRate)
    };
  });
};