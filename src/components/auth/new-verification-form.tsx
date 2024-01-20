'use client'

import React from 'react'
import { BeatLoader } from 'react-spinners'

import { newVerification } from '@/actions/new-verification'
import { CardWrapper } from '@/components/auth/card-wrapper'
import { FormError } from '@/components/form-error'
import { FormSuccess } from '@/components/form-success'
import { useSearchParams } from 'next/navigation'

export const NewVerificationForm = () => {
  const [error, setError] = React.useState<string | undefined>()
  const [success, setSuccess] = React.useState<string | undefined>()

  const searchParams = useSearchParams()

  const token = searchParams.get('token')

  const onSubmit = React.useCallback(() => {
    if (!token) {
      setError('Missing token!')
      return
    }

    newVerification(token)
      .then((data) => {
        setSuccess(data?.success)
        setError(data?.error)
      })
      .catch(() => {
        setError('Oops! Something went wrong!')
      })
  }, [token])

  React.useEffect(() => {
    onSubmit()
  }, [onSubmit])

  return (
    <CardWrapper
      headerLabel='Confirming your verification'
      backButtonLabel='Back to logiin'
      backButtonHref='/auth/login'
    >
      <div className='flex items-center w-full justify-center'>
        {!success && !error && <BeatLoader />}

        <FormSuccess message={success} />
        <FormError message={error} />
      </div>
    </CardWrapper>
  )
}
