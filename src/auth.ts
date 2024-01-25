import authConfig from '@/auth.config'
import { getAccountByUserId } from '@/data/account'
import { getTwoFactorConfirmationByUserId } from '@/data/twoFactorConfirmation'
import { getUserById } from '@/data/user'
import { db } from '@/lib/db'
import { PrismaAdapter } from '@auth/prisma-adapter'
import type { UserRole } from '@prisma/client'
import NextAuth from 'next-auth'

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  unstable_update,
} = NextAuth({
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      })
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth without email verification
      if (account?.provider !== 'credentials') return true

      if (!user?.id) return false

      const existingUser = await getUserById(user.id)

      // Prevent sing in without email verification
      if (!existingUser?.emailVerified) return false

      if (existingUser?.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser?.id
        )

        if (!twoFactorConfirmation) return false

        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation?.id },
        })
      }

      return true
    },
    // @ts-expect-error session callback params does not include token next-auth "^5.0.0-beta.4"
    async session({ token, session }) {
      if (token?.sub && session?.user) {
        session.user.id = token.sub
      }

      if (token?.role && session?.user) {
        session.user.role = token.role as UserRole
      }

      if (token?.isTwoFactorEnabled && session?.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean
      }

      if (session?.user) {
        session.user.name = token.name
        session.user.email = token.email
        session.user.isOAuth = token.isOAuth as boolean
      }

      return session
    },
    async jwt({ token }) {
      if (!token?.sub) return token

      const existingUser = await getUserById(token.sub)

      if (!existingUser) return token

      const existingAccount = await getAccountByUserId(existingUser?.id)

      token.isOAuth = !!existingAccount
      token.name = existingUser.name
      token.email = existingUser.email
      token.role = existingUser.role
      token.isTwoFactorEnabled = existingUser?.isTwoFactorEnabled

      return token
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  ...authConfig,
})
