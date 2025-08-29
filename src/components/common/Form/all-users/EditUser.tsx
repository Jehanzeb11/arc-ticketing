'use client'
import { Box, Grid, Typography } from '@mui/material'
import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useMutation, useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import ButtonCustom from '@/components/common/Button/Button'
import GlobalInput from '@/components/common/Input/GlobalInput'
import FormSelect from '@/components/common/Select'
import { useApiStore } from '@/lib/api/apiStore'

export default function EditUser ({ getall, onCloseModal, userData }: any) {
  const { callApi, updateUser, fetchRoles, fetchDepartments }: any = useApiStore()
  
  // Fetch roles and departments
  const { data: roles } = useQuery({
    queryKey: ['roles'],
    queryFn: () => callApi(fetchRoles),
  })
  
  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: () => callApi(fetchDepartments),
  })
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    defaultValues: {
      fullName: userData?.user_name || '',
      email: userData?.user_email || '',
      role: userData?.user_role || '',
      department: userData?.user_department || '',
      status: userData?.user_status || ''
    }
  })

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      // Prepare user data according to the db.json structure
      const userDataToUpdate = {
        user_name: data.fullName,
        user_email: data.email,
        user_role: data.role,
        user_department: data.department,
        user_status: data.status
      }
      return callApi(updateUser, userData?.id, userDataToUpdate)
    },
    onSuccess: (response, data) => {
      toast.success('User updated successfully!')
      getall() // Refresh the user list
      onCloseModal()
      reset()
    },
    onError: error => toast.error(`Failed to update user: ${error.message}`)
  })

  const onSubmit = (data: any) => mutation.mutate(data)

  // Dynamic options from API
  const roleOptions = roles?.map(role => ({
    label: role.roleName,
    value: role.roleName
  })) || []

  const departmentOptions = departments?.map(dept => ({
    label: dept.name,
    value: dept.name
  })) || []

  const statusOptions = [
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' }
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <GlobalInput
            type='text'
            label='Full Name'
            {...register('fullName', { required: 'Full Name is required' })}
          />
          {errors.fullName && (
            <Typography variant='caption' color='error' sx={{ mt: -1, ml: 1 }}>
              {errors.fullName.message}
            </Typography>
          )}
        </Grid>
        <Grid size={{ xs: 12 }}>
          <GlobalInput
            type='email'
            label='Email'
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: 'Invalid email address'
              }
            })}
          />
          {errors.email && (
            <Typography variant='caption' color='error' sx={{ mt: -1, ml: 1 }}>
              {errors.email.message}
            </Typography>
          )}
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Controller
            name='role'
            control={control}
            rules={{ required: 'Role is required' }}
            render={({ field }) => (
              <FormSelect
                label='Role'
                name='role'
                defaultText='Select Role'
                value={field.value || ''}
                onChange={e => field.onChange(e.target.value)}
                options={roleOptions}
              />
            )}
          />
          {errors.role && (
            <Typography variant='caption' color='error' sx={{ mt: -1, ml: 1 }}>
              {errors.role.message}
            </Typography>
          )}
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Controller
            name='department'
            control={control}
            rules={{ required: 'Department is required' }}
            render={({ field }) => (
              <FormSelect
                label='Department'
                name='department'
                defaultText='Select Department'
                value={field.value || ''}
                onChange={e => field.onChange(e.target.value)}
                options={departmentOptions}
              />
            )}
          />
          {errors.department && (
            <Typography variant='caption' color='error' sx={{ mt: -1, ml: 1 }}>
              {errors.department.message}
            </Typography>
          )}
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Controller
            name='status'
            control={control}
            rules={{ required: 'Status is required' }}
            render={({ field }) => (
              <FormSelect
                label='Status'
                name='status'
                defaultText='Select Status'
                value={field.value || ''}
                onChange={e => field.onChange(e.target.value)}
                options={statusOptions}
              />
            )}
          />
          {errors.status && (
            <Typography variant='caption' color='error' sx={{ mt: -1, ml: 1 }}>
              {errors.status.message}
            </Typography>
          )}
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', gap: '15px', mt: '35px' }}>
        <ButtonCustom
          text='Cancel'
          btntrasnparent={true}
          onClick={onCloseModal}
        />
        <ButtonCustom
          text={isSubmitting ? 'Saving...' : 'Save'}
          type='submit'
          disabled={isSubmitting}
        />
      </Box>
    </form>
  )
}
