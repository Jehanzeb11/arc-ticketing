'use client'
import React, { useState } from 'react'
import { Box, Grid, Typography } from '@mui/material'
import Button from '@/components/common/Button/Button'
import GlobalInput from '@/components/common/Input/GlobalInput'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import ReusableDateTimePicker from '@/components/common/Input/NewDatePicker'
import dayjs, { Dayjs } from 'dayjs'
import { useForm, Controller } from 'react-hook-form'
import { isNullOrUndefined } from 'util'
import EnhancedTable from '@/components/common/Table/ReusableTable'
import { useApiStore } from '@/lib/api/apiStore'
import { useQueryClient } from '@tanstack/react-query'

// interface CallActivityModalProps {
//   setCallActivityModal: (open: boolean) => void
//   trunkId: string
//   columns: { key: string; title: string }[]
//   data: {
//     Connecttime: string
//     Caller: string
//     Destination: string
//     [key: string]: any
//   }[]
// }

interface FilterFormData {
  fromDate: Dayjs | null
  toDate: Dayjs | null
  caller: string
  destination: string
}

function CallActivityModal ({
  setCallActivityModal,
  trunkId,
  columns,
  data,
  isLoading
}: any) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { callApi, fetchXdrList }: any = useApiStore()
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<FilterFormData>({
    defaultValues: {
      fromDate: dayjs(),
      toDate: dayjs(),
      caller: '',
      destination: ''
    }
  })

  // const [filteredData, setFilteredData] = useState(data) // Initialize with all data
  // const fromDate = watch('fromDate') // Watch fromDate for toDate validation
  // const toDate = watch('toDate') // Watch toDate for fromDate validation

  // const onSubmit = (formData: FilterFormData) => {
  //   // Validate that fromDate is not after toDate
  //   if (
  //     formData.fromDate &&
  //     formData.toDate &&
  //     formData.fromDate.isAfter(formData.toDate)
  //   ) {
  //     toast.error('From Date must be before or equal to To Date')
  //     return
  //   }

  //   // Filter data based on form submission
  //   const filtered = data.filter(item => {
  //     const fromDate = formData.fromDate ? dayjs(formData.fromDate) : null
  //     const toDate = formData.toDate ? dayjs(formData.toDate) : null
  //     const itemDate = dayjs(item.Connecttime) // Using Connecttime as date field

  //     const isDateInRange =
  //       (!fromDate ||
  //         !fromDate.isValid() ||
  //         itemDate.isAfter(fromDate, 'day') ||
  //         itemDate.isSame(fromDate, 'day')) &&
  //       (!toDate ||
  //         !toDate.isValid() ||
  //         itemDate.isBefore(toDate, 'day') ||
  //         itemDate.isSame(toDate, 'day'))

  //     const isCallerMatch =
  //       !formData.caller ||
  //       item.Caller?.toLowerCase().includes(formData.caller.toLowerCase())
  //     const isDestinationMatch =
  //       !formData.destination ||
  //       item.Destination?.toLowerCase().includes(
  //         formData.destination.toLowerCase()
  //       )

  //     return isDateInRange && isCallerMatch && isDestinationMatch
  //   })

  //   setFilteredData(filtered)
  //   toast.success('Search applied!')
  // }

  const [filteredData, setFilteredData] = useState(data) // Initialize with prop data
  const [isFilterLoading, setIsFilterLoading] = useState(false)
  const fromDate = watch('fromDate')
  const toDate = watch('toDate')

  const onSubmit = async (formData: FilterFormData) => {
    // Validate that fromDate is not after toDate if both are set
    if (
      formData.fromDate &&
      formData.toDate &&
      formData.fromDate.isAfter(formData.toDate)
    ) {
      toast.error('From Date must be before or equal to To Date')
      return
    }

    setIsFilterLoading(true)
    try {
      const params = {
        i_account: 644,
        account_id: trunkId,
        ...(formData.fromDate && {
          from_date: formData.fromDate.format('YYYY-MM-DD HH:mm:ss')
        }),
        ...(formData.toDate && {
          to_date: formData.toDate.format('YYYY-MM-DD HH:mm:ss')
        }),
        ...(formData.caller && { cli: `%${formData.caller}%` }),
        ...(formData.destination && { cld: `%${formData.destination}%` })
      }

      const response = await callApi(fetchXdrList, { params })
      if (response && response.xdr_list) {
        queryClient.setQueryData(['sipTrunks'], response)
        setFilteredData(response?.xdr_list || [])
      } else {
        toast.error('No data returned from filter')
      }

      toast.success('Search applied!')
    } catch (error) {
      toast.error('Failed to apply search')
    } finally {
      setIsFilterLoading(false)
    }
  }
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            mb: '10px'
          }}
          className='call-activity-modal'
        >
          <Controller
            name='fromDate'
            control={control}
            rules={{
              required: 'From Date is required'
            }}
            render={({ field }) => (
              <>
                <ReusableDateTimePicker
                  label='From Date'
                  value={field.value || dayjs()}
                  onChange={(newValue: Dayjs | null) =>
                    field.onChange(newValue)
                  }
                  variant='mobile'
                  maxDateTime={toDate} // Disable dates after toDate
                />
                {errors.fromDate && (
                  <Typography
                    variant='caption'
                    color='error'
                    sx={{ mt: -1, ml: 1 }}
                  >
                    {errors.fromDate.message as string}
                  </Typography>
                )}
              </>
            )}
          />
          <Controller
            name='toDate'
            control={control}
            rules={{
              required: 'To Date is required',
              validate: value =>
                !fromDate ||
                !value ||
                dayjs(value).isAfter(fromDate) ||
                dayjs(value).isSame(fromDate) ||
                'To Date must be after or equal to From Date'
            }}
            render={({ field }) => (
              <>
                <ReusableDateTimePicker
                  label='To Date'
                  value={field.value || dayjs()}
                  onChange={(newValue: Dayjs | null) =>
                    field.onChange(newValue)
                  }
                  variant='mobile'
                  minDateTime={fromDate} // Disable dates before fromDate
                />
                {errors.toDate && (
                  <Typography
                    variant='caption'
                    color='error'
                    sx={{ mt: -1, ml: 1 }}
                  >
                    {errors.toDate.message as string}
                  </Typography>
                )}
              </>
            )}
          />
          <Controller
            name='caller'
            control={control}
            render={({ field }) => (
              <GlobalInput
                type='text'
                label=''
                placeholder='Caller'
                name='caller'
                value={field.value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  field.onChange(e.target.value)
                }
              />
            )}
          />
          <Controller
            name='destination'
            control={control}
            render={({ field }) => (
              <GlobalInput
                type='text'
                label=''
                placeholder='Destination'
                name='destination'
                value={field.value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  field.onChange(e.target.value)
                }
              />
            )}
          />
          <Button type='submit' text='Search' />
        </Box>
      </form>
      <div className='table-parent'>
        <EnhancedTable
          columns={columns}
          data={filteredData}
          enableSorting={true}
          enablePagination={true}
          enableFiltering={false}
          enableRowSelection={false}
          pageSize={5}
          isLoading={isLoading || isFilterLoading}
        />
      </div>
      <Grid container sx={{ mt: '20px' }} size={{ xs: 12 }}>
        <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'end' }}>
          <Button
            type='button'
            text='Close'
            onClick={() => setCallActivityModal(false)}
          />
        </Grid>
      </Grid>
    </>
  )
}

export default CallActivityModal
