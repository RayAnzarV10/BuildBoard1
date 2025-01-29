import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { currentUser } from '@clerk/nextjs/server'

const f = createUploadthing()

const authenticateUser = async () => {
  const user = await currentUser()
  
  if (!user) throw new Error('Unauthorized')
  
  return { userId: user.id }
}

export const ourFileRouter = {
  avatar: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(authenticateUser)
    .onUploadComplete(async ({ metadata }) => {
      console.log('Upload complete for userId:', metadata.userId)
    }),
  logo: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(authenticateUser)
    .onUploadComplete(async ({ metadata }) => {
      console.log('Upload complete for userId:', metadata.userId)
    }),
  media: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(authenticateUser)
    .onUploadComplete(async ({ metadata }) => {
      console.log('Upload complete for userId:', metadata.userId)
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter