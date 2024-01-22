'use client'

import React from 'react'

import { logout } from '@/actions/logout'

const SettingsPage = () => {
  const onClick = () => {
    logout()
  }

  return (
    <div className='bg-white p-10 rounded-xl'>
      <button type='button' onClick={onClick}>
        Sign out
      </button>
    </div>
  )
}

export default SettingsPage
