'use client'

import { Grid, IconButton, Tooltip } from '@mui/material'
import React, { useState } from 'react'
import Image from 'next/image'
import GlobalInput from '@/components/common/Input/GlobalInput'
import GlobalTextarea from '@/components/common/textarea/GlobalTextarea'
import Button from '@/components/common/Button/Button'
import FormSelect from '@/components/common/Select'
import InfoIcon from '@/assets/icons/modal/info.svg'
import { useForm, FieldValues } from 'react-hook-form'
import { skipToken, useMutation } from '@tanstack/react-query'
import toast, { Toaster } from 'react-hot-toast'
import { useApiStore } from '@/lib/api/apiStore'
import GlobalDatePickerInput from '@/components/common/Input/GlobalDatePickerInput'
import dayjs, { Dayjs } from 'dayjs'
import calendarIcon from '@/assets/icons/calendar.svg'

export default function NewUser ({ getall, onCloseModal }) {
  const [date, setDate]: any = useState<Dayjs | null>(dayjs())

  const { callApi, createUser }: any = useApiStore()
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm()

  const mutation = useMutation({
    mutationFn: (data: FieldValues) =>
      callApi(
        createUser,
        {
          user_name: data.username,
          user_password: data.password,
          user_email: data.email,
          user_company: data.companyName,
          user_role: data.role || 'user',
          user_status: data.status || 'pending',
          activation_date: data.activationDate,
          expiration_date: data.expirationDate,
          timezone: data.timezone,
          language: data.language
        },
        {},
        null,
        { headers: { 'X-Request-Source': 'NewUserForm' } }
      ),
    onSuccess: () => {
      toast.success('User created successfully!')
      if (getall) getall()
      if (onCloseModal) onCloseModal()
    },
    onError: error => toast.error('Failed to create user: ' + error.message)
  })

  const onSubmit = data => mutation.mutate(data)

  return (
    <div>
      <Toaster position='top-right' />
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3>
          General{' '}
          <Tooltip title='Info'>
            <IconButton>
              <Image src={InfoIcon} alt='Info' />
            </IconButton>
          </Tooltip>
        </h3>
        <Grid container spacing={3} sx={{ mb: '45px' }}>
          <Grid container spacing={3} size={{ xs: 12 }}>
            <Grid size={{ xs: 6 }}>
              <GlobalInput
                type='text'
                label='Login'
                placeholder='Type here'
                {...register('username', {
                  required: 'User Name is required',
                  minLength: {
                    value: 3,
                    message: 'User Name should be at least 3 characters'
                  }
                })}
              />
              {errors.username && (
                <p style={{ color: '#B80505', margin: '0px' }}>
                  {errors.username.message as any}
                </p>
              )}
            </Grid>
            <Grid size={{ xs: 6 }}>
              <GlobalInput
                type='password'
                label='Password'
                placeholder='Type here'
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters'
                  },
                  maxLength: {
                    value: 32,
                    message: 'Password must be less than 32 characters'
                  }
                })}
              />
              {errors.password && (
                <p style={{ color: '#B80505', margin: '0px' }}>
                  {errors.password.message as any}
                </p>
              )}
            </Grid>
          </Grid>
          <Grid container spacing={3} size={{ xs: 12 }}>
            <Grid size={{ xs: 6 }}>
              <GlobalInput
                type='email'
                label='Email'
                placeholder='Enter Email'
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Invalid email'
                  }
                })}
              />
              {errors.email && (
                <p style={{ color: '#B80505', margin: '0px' }}>
                  {errors.email.message as any}
                </p>
              )}
            </Grid>
            <Grid size={{ xs: 6 }}>
              <FormSelect
                label='Role'
                name='role'
                value={watch('role') || ''}
                onChange={e => register('role').onChange(e)}
                options={[
                  { label: 'admin', value: 'admin' },
                  { label: 'user', value: 'user' }
                ]}
                {...register('role', { required: 'Role is required' })}
              />
              {errors.role && (
                <p style={{ color: '#B80505', margin: '0px' }}>
                  {errors.role.message as any}
                </p>
              )}
            </Grid>
          </Grid>
        </Grid>
        <h3>
          Change Status
          <Tooltip title='Info'>
            <IconButton>
              <Image src={InfoIcon} alt='Info' />
            </IconButton>
          </Tooltip>
        </h3>
        <Grid container spacing={3}>
          <Grid container spacing={3} size={{ xs: 12 }}>
            <Grid size={{ xs: 6 }}>
              <GlobalInput
                type='date'
                label='Activation Date'
                placeholder='Select Date'
                {...register('activationDate', {
                  required: 'Activation Date is required'
                })}
              />
              {errors.activationDate && (
                <p style={{ color: '#B80505', margin: '0px' }}>
                  {errors.activationDate.message as any}
                </p>
              )}
            </Grid>
            <Grid size={{ xs: 6 }}>
              <GlobalInput
                type='date'
                label='Expiration Date'
                placeholder='Select Date'
                {...register('expirationDate', {
                  required: 'Expiration Date is required'
                })}
              />
              {errors.expirationDate && (
                <p style={{ color: '#B80505', margin: '0px' }}>
                  {errors.expirationDate.message as any}
                </p>
              )}
            </Grid>
          </Grid>
          <Grid container spacing={3} size={{ xs: 12 }}>
            <Grid size={{ xs: 6 }}>
              <FormSelect
                label='Timezone'
                name='timezone'
                value={watch('timezone') || ''}
                onChange={e => register('timezone').onChange(e)}
                options={[
                  { label: 'UTC+5', value: 'UTC+5' },
                  { label: 'UTC+6', value: 'UTC+6' }
                ]}
                {...register('timezone', { required: 'Timezone is required' })}
              />
              {errors.timezone && (
                <p style={{ color: '#B80505', margin: '0px' }}>
                  {errors.timezone.message as any}
                </p>
              )}
            </Grid>
            <Grid size={{ xs: 6 }}>
              <FormSelect
                label='Language'
                name='language'
                value={watch('language') || ''}
                onChange={e => register('language').onChange(e)}
                options={[
                  { label: 'English', value: 'en' },
                  { label: 'Spanish', value: 'es' }
                ]}
                {...register('language', { required: 'Language is required' })}
              />
              {errors.language && (
                <p style={{ color: '#B80505', margin: '0px' }}>
                  {errors.language.message as any}
                </p>
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid
          container
          spacing={3}
          size={{ xs: 12 }}
          sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: '45px' }}
        >
          <Button
            type='button'
            text='Cancel'
            btntrasnparent={true}
            onClick={onCloseModal}
          />
          <Button
            type='submit'
            text={isSubmitting ? 'Saving...' : 'Save Changes'}
            disabled={isSubmitting}
          />
        </Grid>
      </form>
    </div>
  )
}
