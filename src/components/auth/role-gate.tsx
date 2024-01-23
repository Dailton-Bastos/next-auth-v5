'use client'

import React from 'react'

import { FormError } from '@/components/form-error'
import { useCurrentRole } from '@/hooks/use-current-role'
import type { UserRole } from '@prisma/client'

type PropsType = {
  children: React.ReactNode
  allowedRole: UserRole
}

export const RoleGate = ({ children, allowedRole = 'ADMIN' }: PropsType) => {
  const role = useCurrentRole()

  if (role !== allowedRole) {
    return (
      <FormError message='You do not have permission to view this content!' />
    )
  }

  return <>{children}</>
}
