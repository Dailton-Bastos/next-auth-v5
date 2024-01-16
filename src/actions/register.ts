'use server'

import { getUserByEmail } from '@/data/user'
import { db } from '@/lib/db'
import { sendVerificationEmail } from '@/lib/mail'
import { generateVerificationToken } from '@/lib/tokens'
import { registerSchema } from '@/schemas'
import bcrypt from 'bcryptjs'
import * as z from 'zod'

export const register = async (values: z.infer<typeof registerSchema>) => {
  const validatedFields = registerSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' }
  }

  const { email, password, name } = validatedFields.data

  const existingUser = await getUserByEmail(email)

  if (existingUser) return { error: 'Email already in use!' }

  const hashedPassword = await bcrypt.hash(password, 10)

  await db.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
    },
  })

  const verificationToken = await generateVerificationToken(email)

  await sendVerificationEmail(verificationToken.email, verificationToken.token)

  return { success: 'Confirmation email sent!' }
}
