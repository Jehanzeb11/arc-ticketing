import React from 'react'
import { Skeleton, Grid, Box } from '@mui/material'
import Button from '@/components/common/Button/Button'

export default function SettingSkeleton () {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, lg: 3.5 }}>
        <Skeleton
          variant='rounded'
          width={366}
          height={310}
          sx={{ borderRadius: '20px' }}
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 6 }}>
        {/* <Skeleton variant='text' width='40%' height={30} /> */}
        <h2>General</h2>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
          <Skeleton
            variant='rectangular'
            width='48%'
            height={50}
            sx={{ mt: 2, borderRadius: '30px' }}
          />
          <Skeleton
            variant='rectangular'
            width='48%'
            height={50}
            sx={{ mt: 2, borderRadius: '30px' }}
          />
          <Skeleton
            variant='rectangular'
            width='48%'
            height={50}
            sx={{ mt: 2, borderRadius: '30px' }}
          />
          <Skeleton
            variant='rectangular'
            width='48%'
            height={50}
            sx={{ mt: 2, borderRadius: '30px' }}
          />
        </Box>

        <Button type='button' text='Save Changes' />
      </Grid>
    </Grid>
  )
}
