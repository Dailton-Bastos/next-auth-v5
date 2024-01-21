'use client'

import React from 'react'
import { useForm } from 'react-hook-form'

import { newPassword } from '@/actions/new-password'
import { CardWrapper } from '@/components/auth/card-wrapper'
import { FormError } from '@/components/form-error'
import { FormSuccess } from '@/components/form-success'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { newPasswordSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams } from 'next/navigation'
import * as z from 'zod'

export const NewPasswordForm = () => {
  const [error, setError] = React.useState<string | undefined>('')
  const [success, setSuccess] = React.useState<string | undefined>('')
  const [isPending, startTransition] = React.useTransition()

  const searchParams = useSearchParams()

  const token = searchParams.get('token')

  const form = useForm<z.infer<typeof newPasswordSchema>>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: '',
    },
  })

  const onSubmit = (values: z.infer<typeof newPasswordSchema>) => {
    setError('')
    setSuccess('')

    startTransition(() => {
      newPassword(values, token).then((data) => {
        setError(data?.error)
        setSuccess(data?.success)
      })
    })
  }

  return (
    <CardWrapper
      headerLabel='Enter a new password'
      backButtonLabel='Back to login'
      backButtonHref='/auth/login'
    >
      <Form {...form}>
        <form className='space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
          <div className='space-y-4'>
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder='******'
                      type='password'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormError message={error} />
          <FormSuccess message={success} />

          <Button type='submit' className='w-full' disabled={isPending}>
            Reset password
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
