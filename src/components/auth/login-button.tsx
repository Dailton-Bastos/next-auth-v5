'use client'

import React from 'react'

import { useRouter } from 'next/navigation'

import { Button } from '../ui/button'

type PropsType = {
  children: React.ReactNode
  mode?: 'modal' | 'redirect'
  asChild?: boolean
}

export const LoginButton = ({
  children,
  mode = 'redirect',
  asChild = false,
}: PropsType) => {
  const router = useRouter()

  const onClick = () => {
    router.push('/auth/login')
  }

  if (mode === 'modal') return <span>TODO: Implement modal</span>

  return (
    <Button onClick={onClick} variant='secondary' size='lg' asChild={asChild}>
      <span>{children}</span>
    </Button>
  )
}
