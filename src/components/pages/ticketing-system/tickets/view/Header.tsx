import { ArrowBack } from '@mui/icons-material'
import { Box, Grid, IconButton, Typography } from '@mui/material'
import React from 'react'
import TableSelectFilterMain from '@/components/common/Select/TableSelectFilterMain'
import Button from '@/components/common/Button/Button'
import { useRouter } from 'next/navigation'
import TableSelectFilterMainNew from '@/components/common/Select/TableSelectFilterMainNew'

export default function UniBoxViewHeader ({
  filters,
  onChange,
  onApplyFilter
}: any) {
  const router = useRouter()
  return (
    <Grid container justifyContent={'space-between'} alignItems={'center'}>
      <Grid size={{ lg: 3, xs: 12 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <IconButton
            onClick={() => router.back()}
            sx={{ background: 'white' }}
          >
            <ArrowBack />
          </IconButton>
          <Typography sx={{ fontWeight: '600', fontSize: '30px' }}>
            Back to Unibox
          </Typography>
        </Box>
      </Grid>
      <Grid size={{ lg: 7, xs: 12 }}>
        <Grid
          container
          sx={{ alignItems: 'center', justifyContent: 'flex-end' }}
          spacing={2}
        >
          {filters.map((filter: any, index: number) => (
            <Grid size={{ lg: 3, xs: 12 }} key={index}>
              <TableSelectFilterMainNew
                value={filter.value || ''}
                name={filter.name}
                options={filter.filterOptions}
                popperClassName={filter.className}
                defaultText='All'
                className='table-dropdown-select view'
                onChange={onChange}
              />
            </Grid>
          ))}
          <Grid size={{ lg: 4, xs: 12 }}>
            <Box
              sx={{ display: 'flex', gap: '10px' }}
              className='ticket-button'
            >
              <Button text='Open' btntrasnparent />
              <Button
                text='Apply filter'
                btntrasnparent
                onClick={onApplyFilter}
              />
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
