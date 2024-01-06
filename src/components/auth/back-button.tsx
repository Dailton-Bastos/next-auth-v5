'use client'

import React from 'react'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

type PropsType = {
  href: string
  label: string
}

export const BackButton = ({ label, href }: PropsType) => {
  return (
    <Button variant='link' size='sm' asChild className='font-normal w-full'>
      <Link href={href}>{label}</Link>
    </Button>
  )
}
