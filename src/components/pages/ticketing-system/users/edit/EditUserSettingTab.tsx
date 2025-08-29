import { Box, Grid, IconButton, Tooltip } from '@mui/material'
import React from 'react'
import Image from 'next/image'
import GlobalInput from '@/components/common/Input/GlobalInput'
import GlobalTextarea from '@/components/common/textarea/GlobalTextarea'
import Button from '@/components/common/Button/Button'
import FormSelect from '@/components/common/Select'
import InfoIcon from '@/assets/icons/modal/info.svg'
import deleteIcon from '@/assets/icons/users/deleteIcon.svg'
import GlobalPasswordInput from '@/components/common/Input/GlobalPasswordInput'
import { useForm, FieldValues } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useApiStore } from '@/lib/api/apiStore'
import { useWatch } from 'react-hook-form' // Add this import

export default function EditUserSettingTab ({
  userId,
  userData,
  onUpdateSuccess
}) {
  const { callApi, updateUser }: any = useApiStore()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    control // Add control for useWatch
  } = useForm({
    defaultValues: userData || {}
  })
  // abc
  // Watch the form values for Select components
  const watchRole = useWatch({ control, name: 'role' })
  const watchTimezone = useWatch({ control, name: 'timezone' })
  const watchLanguage = useWatch({ control, name: 'language' })

  React.useEffect(() => {
    if (userData) {
      setValue('username', userData.user_name || '')
      setValue('password', userData.user_password || '')
      setValue('email', userData.user_email || '')
      setValue('role', userData.user_role || '')
      setValue('activationDate', userData.activation_date || '')
      setValue('expirationDate', userData.expiration_date || '')
      setValue('timezone', userData.timezone || '')
      setValue('language', userData.language || '')
    }
  }, [userData, setValue])

  const mutation = useMutation({
    mutationFn: (data: FieldValues) =>
      callApi(
        updateUser,
        userId,
        {
          user_name: data.username,
          user_password: data.password,
          user_email: data.email,
          user_company: data.companyName || '',
          user_role: data.role,
          activation_date: data.activationDate,
          expiration_date: data.expirationDate,
          timezone: data.timezone,
          language: data.language
        },
        {},
        null,
        { headers: { 'X-Request-Source': 'EditUserForm' } }
      ),
    onSuccess: () => {
      toast.success('User updated successfully!')
      if (onUpdateSuccess) onUpdateSuccess()
    },
    onError: error => toast.error('Failed to update user: ' + error.message)
  })

  const onSubmit = data => mutation.mutate(data)

  return (
    <>
      <h3>
        General
        <Tooltip title='Info'>
          <IconButton>
            <Image src={InfoIcon} alt='Info' />
          </IconButton>
        </Tooltip>{' '}
      </h3>
      <Grid container spacing={3} sx={{ mb: '45px' }}>
        {/* Row 1 */}
        <Grid container spacing={3} size={{ xs: 8 }}>
          <Grid size={{ xs: 6 }}>
            <GlobalInput
              type='text'
              label='Login'
              placeholder='Login'
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
            <GlobalPasswordInput
              name='password'
              placeholder='Password'
              label='Password'
              setValue={setValue} // ✅ Pass this from props
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters'
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
        {/* Row 2 */}
        <Grid container spacing={3} size={{ xs: 8 }}>
          <Grid size={{ xs: 6 }}>
            <GlobalInput
              type='email'
              label='Email'
              placeholder='Email'
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
              value={watchRole || ''} // Use watched value
              onChange={e => setValue('role', e.target.value)} // Update form state
              options={[
                { label: 'Admin', value: 'admin' },
                { label: 'User', value: 'user' }
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
        Change Status{' '}
        <Tooltip title='Info'>
          <IconButton>
            <Image src={InfoIcon} alt='Info' />
          </IconButton>
        </Tooltip>{' '}
      </h3>
      <Grid container spacing={3}>
        {/* Row 1 */}
        <Grid container spacing={3} size={{ xs: 8 }}>
          <Grid size={{ xs: 6 }}>
            <GlobalInput
              type='date'
              label='Activation Date'
              placeholder='Activation Date'
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
              placeholder='Expiration Date'
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
        {/* Row 2 */}
        <Grid container spacing={3} size={{ xs: 8 }}>
          <Grid size={{ xs: 6 }}>
            <FormSelect
              label='Timezone'
              name='timezone'
              value={watchTimezone || ''} // Use watched value
              onChange={e => setValue('timezone', e.target.value)} // Update form state
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
              value={watchLanguage || ''} // Use watched value
              onChange={e => setValue('language', e.target.value)} // Update form state
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
      {/* Buttons */}
      <Grid size={{ xs: 12 }} sx={{ mt: '70px' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Box sx={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <Button type='button' text='Cancel' btntrasnparent={true} />
            <Button
              type='submit'
              text='Save Changes'
              disabled={isSubmitting}
              onClick={handleSubmit(onSubmit)}
            />
          </Box>
          <Button btnDelete={true} text='Delete' icon={deleteIcon} />
        </Box>
      </Grid>
    </>
  )
}
