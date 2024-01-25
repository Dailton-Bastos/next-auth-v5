'use server'

import { getUserByEmail } from '@/data/user'
import { getVerificationTokenByToken } from '@/data/verificationToken'
import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token)

  if (!existingToken) {
    return { error: 'Token does not exist!' }
  }

  const hasExpiredToken = new Date(existingToken?.expires) < new Date()

  if (hasExpiredToken) {
    return { error: 'Token has expired!' }
  }

  const existingUser = await getUserByEmail(existingToken?.email)

  const hasAuthenticateUser = await currentUser()

  if (!existingUser && !hasAuthenticateUser) {
    return { error: 'Email does not exist!' }
  }

  const id = hasAuthenticateUser ? hasAuthenticateUser.id : existingUser?.id

  await db.user.update({
    where: { id },
    data: {
      emailVerified: new Date(),
      email: existingToken?.email,
    },
  })

  await db.verificationToken.delete({
    where: { id: existingToken?.id },
  })

  return { success: 'Email verified!' }
}
