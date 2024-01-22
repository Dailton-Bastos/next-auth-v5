'use client'

import React from 'react'

import { logout } from '@/actions/logout'
import { Button } from '@/components/ui/button'
// import { signOut } from "next-auth/react";

type PropsType = {
  children?: React.ReactNode
}

export const LogoutButton = ({ children }: PropsType) => {
  const onClick = () => {
    logout()
  }

  return (
    <Button asChild variant='ghost' onClick={onClick} className='w-full'>
      {children}
    </Button>
  )
}
