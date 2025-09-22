'use client'
import { Badge, Box, IconButton, Typography } from '@mui/material'
import React from 'react'
import NotificationsIcon from '@/assets/icons/dashboard/notificationIcon.svg'
import AccountMenu from '@/components/layout/Sidebar/AccountMenu'
import Image from 'next/image'

function AnalyticsHeader() {
  return (
    <div className='main-ai-agentHeader'>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #00000010',
          paddingBottom: '15px',
        }}
      >
        <Typography variant="h5" className="header-title">
          Agent Performance Analytics          </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <IconButton
            size='large'
            aria-label='show 17 new notifications'
            color='inherit'
            sx={{ padding: 0 }}
          >
            <Badge badgeContent={17} color='error'>
              <Image src={NotificationsIcon} alt='' />
            </Badge>
          </IconButton>

          <AccountMenu />
        </Box>
      </Box>
    </div>
  )
}

export default AnalyticsHeader
