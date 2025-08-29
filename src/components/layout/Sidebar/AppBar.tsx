import React from 'react'
import { styled } from '@mui/material/styles'
import MenuIcon from '@mui/icons-material/Menu'
import Typography from '@mui/material/Typography'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import { Badge, Box } from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications'
import MailIcon from '@mui/icons-material/Mail'
import AccountMenu from './AccountMenu'
import SearchBar from './Search'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import Image from 'next/image'

export default function AppBar ({
  open,
  setOpen,
  drawerWidth,
  handleDrawerClose
}: any) {
  interface AppBarProps extends MuiAppBarProps {
    open?: boolean
  }

  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: prop => prop !== 'open'
  })<AppBarProps>(({ theme }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    variants: [
      {
        props: ({ open }) => open,
        style: {
          marginLeft: drawerWidth,
          width: `calc(100% - ${drawerWidth}px)`,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
          })
        }
      }
    ]
  }))

  return (
    <AppBar
      position='fixed'
      open={open}
      sx={{
        background: 'transparent',
        py: 1,
        boxShadow: 'none',
        display: 'none'
      }}
    >
      <Toolbar>
        {/* <Typography variant='h5' noWrap component='div' sx={{ mr: 5 , ml:2}}>
          Blog Admin Panel
        </Typography> */}
        {/* <SearchBar /> */}
        <Box sx={{ flexGrow: 1 }}></Box>
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          {/* <IconButton
            size='large'
            aria-label='show 4 new mails'
            color='inherit'
          >
            <Badge badgeContent={4} color='error'>
              <MailIcon />
            </Badge>
          </IconButton>
          <IconButton
            size='large'
            aria-label='show 17 new notifications'
            color='inherit'
          >
            <Badge badgeContent={17} color='error'>
              <NotificationsIcon />
            </Badge>
          </IconButton> */}

          {/* <AccountMenu /> */}
        </Box>
      </Toolbar>
    </AppBar>
  )
}
