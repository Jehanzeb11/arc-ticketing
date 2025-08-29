'use client'
import { Badge, Box, IconButton, Typography } from '@mui/material'
import React from 'react'
import NotificationsIcon from '@/assets/icons/dashboard/notificationIcon.svg'
import AccountMenu from '@/components/layout/Sidebar/AccountMenu'
import SettingIcon from '@/assets/icons/dashboard/settingicon.svg'
import Image from 'next/image'

function DashboardHeader ({ title, text }: any) {
  return (
    <div
      className='main-dashboardHeader'
      style={{ paddingBottom: '15px', borderBottom: '2px solid #E4E4E7' }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Box>
          <Typography variant='h5' className='header-title'>
            {title || 'title'}
          </Typography>
          <Typography>{text ? text : ''}</Typography>
        </Box>
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
          {/* <IconButton
            size='large'
            aria-label='show 17 new notifications'
            color='inherit'
            sx={{ padding: 0 }}
          >
            <Image src={SettingIcon} alt='' />
          </IconButton> */}

          <AccountMenu />
        </Box>
      </Box>
    </div>
  )
}

export default DashboardHeader
