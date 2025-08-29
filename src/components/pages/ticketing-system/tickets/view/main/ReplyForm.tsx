'use client'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Box, Typography, Button, Chip, Grid } from '@mui/material'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import CheckIcon from '@mui/icons-material/Check'
import FormSelect from '@/components/common/Select'
import GlobalInput from '@/components/common/Input/GlobalInput'
import GlobalTextarea from '@/components/common/textarea/GlobalTextarea'
import replyIcon from '@/assets/icons/unibox/ticket/viewpage/reply.svg'
import Image from 'next/image'
import MyButton from '@/components/common/Button/Button'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
const ReplyForm = ({ ticketId }: any) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm()

  const onSubmit = (data: any) => {
    console.log(data) // Handle form submission logic here
  }

  return (
    <Box
      sx={{
        backgroundColor: '#fff',
        borderRadius: 1,
        mx: 'auto',
        p: '25px',
        filter: 'drop-shadow(0px 16.88px 59.079px rgba(86, 89, 146, 0.10))'
      }}
    >
      <Typography
        variant='h5'
        sx={{
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          fontSize: '25px',
          fontWeight: '600',
          pb: '16px',
          borderBottom: '1px solid #e0e0e0'
        }}
      >
        <Image src={replyIcon} alt='icon' style={{ marginRight: '10px' }} />
        Reply to {ticketId || 'unknown ticket'}
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Typography variant='body2' sx={{ mb: 1, color: '#666' }}>
            CC Emails
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <GlobalInput
              type='text'
              placeholder='Add CC emails.'
              {...register('ccEmails')}
              sx={{ width: '100%' }}
            />
            <Chip
              icon={<PersonAddIcon />}
              label=''
              onClick={() => alert('Add CC email functionality')}
              sx={{ borderRadius: '10px' }}
            />
          </Box>
          {watch('ccEmails') && (
            <Box sx={{ mt: 1 }}>
              <Chip
                label='manager@example.com'
                onDelete={() => setValue('ccEmails', '')}
                sx={{
                  color: 'var(--pri-color)',
                  backgroundColor: 'transparent'
                }}
                size='small'
              />
            </Box>
          )}
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <FormSelect
            label='Department'
            name='department'
            value={watch('department') || ''}
            onChange={e => register('department').onChange(e)}
            options={[
              { label: 'Select', value: '' },
              { label: 'Technical', value: 'technical' },
              { label: 'Sales', value: 'sales' },
              { label: 'Billing', value: 'billing' }
            ]}
            {...register('department', { required: 'Department is required' })}
          />
          {errors.department && (
            <p style={{ color: '#B80505', margin: '0px' }}>
              {errors.department.message as any}
            </p>
          )}
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <FormSelect
            label='Type'
            name='type'
            value={watch('type') || ''}
            onChange={e => register('type').onChange(e)}
            options={[
              { label: 'Select', value: '' },
              { label: 'Support', value: 'support' },
              { label: 'Feature', value: 'feature' },
              { label: 'Bug', value: 'bug' }
            ]}
            {...register('type', { required: 'Type is required' })}
          />
          {errors.type && (
            <p style={{ color: '#B80505', margin: '0px' }}>
              {errors.type.message as any}
            </p>
          )}
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <FormSelect
            label='Priority'
            name='priority'
            value={watch('priority') || ''}
            onChange={e => register('priority').onChange(e)}
            options={[
              { label: 'Select', value: '' },
              { label: 'High', value: 'high' },
              { label: 'Medium', value: 'medium' },
              { label: 'Low', value: 'low' }
            ]}
            {...register('priority', { required: 'Priority is required' })}
          />
          {errors.priority && (
            <p style={{ color: '#B80505', margin: '0px' }}>
              {errors.priority.message as any}
            </p>
          )}
        </Grid>
        <Grid size={{ xs: 12 }}>
          <GlobalTextarea
            placeholder='Type your message here'
            rows={5}
            cols={30}
            {...register('message', { required: 'Message is required' })}
          />
          {errors.message && (
            <p style={{ color: '#B80505', margin: '0px' }}>
              {errors.message.message as any}
            </p>
          )}
        </Grid>
      </Grid>
      <Button
        variant='outlined'
        startIcon={<AttachFileIcon />}
        sx={{
          mt: 2,
          mb: 2,
          color: '#666',
          border: '1px dashed var(--border-color)',
          p: '10px 40px',
          borderRadius: '10px',
          textTransform: 'capitalize',
          fontSize: '16px'
        }}
      >
        Add Files
      </Button>

      {/* Action Buttons */}
      <Box
        sx={{ display: 'flex', justifyContent: 'start', mt: 2, gap: '10px' }}
      >
        <MyButton
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          text='Submit Reply'
        />

        <MyButton
          onClick={() => alert('Cancel clicked')}
          text='Cancel'
          btntrasnparent
        />

        <Button
          variant='outlined'
          onClick={() => alert('Resolve Ticket clicked')}
          sx={{
            borderRadius: '30px',
            border: '1px solid transparent',
            background: 'rgba(63, 140, 255, .15)',
            color: 'var(--pri-color)',
            textTransform: 'capitalize',
            p: '12px 40px'
          }}
        >
          <CheckCircleIcon sx={{ mr: 1, color: 'var(--pri-color)' }} /> Resolve
          Ticket
        </Button>
      </Box>
    </Box>
  )
}

export default ReplyForm
