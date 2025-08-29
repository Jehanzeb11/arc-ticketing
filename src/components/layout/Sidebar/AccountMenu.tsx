import * as React from 'react'
import {
  Box,
  Avatar,
  Typography,
  Tooltip,
  Button,
  Menu,
  MenuItem
} from '@mui/material'
import Link from 'next/link'
import { KeyboardArrowDown } from '@mui/icons-material'
import MyModal from '@/components/common/Modal' // Assuming MyModal is imported from your custom library
import LogoutIcon from '@/assets/icons/modal/deleteModalIcon.svg'
import CustomButton from '@/components/common/Button/Button' // Assuming Button component is imported from your custom library
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'
import ResetPassword from '@/components/common/Form/userForm/ResetPassword'

export default function AccountMenu () {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [logoutModalOpen, setLogoutModalOpen] = React.useState(false)
  const [loginName, setLoginName] = React.useState('')

  const [changePasswordModalOpen, setChangePasswordModalOpen] =
    React.useState(false)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleLogoutClick = () => {
    setAnchorEl(null)
    setLogoutModalOpen(true)
  }
  const handleChangePasswordClick = () => {
    setAnchorEl(null)
    setChangePasswordModalOpen(true)
  }
  const handleLogoutCancel = () => {
    setLogoutModalOpen(false)
  }
  const handleChangePasswordCancel = () => {
    setChangePasswordModalOpen(false)
  }
  const handleLogout = () => {
    Cookies.remove('userData')
    toast.success('Logout Successful!')
    setTimeout(() => {
      window.location.reload()
    }, 100)
  }
  const handleChangePasswordConfirm = () => {
    setChangePasswordModalOpen(false)
  }

  React.useEffect(() => {
    const userData = Cookies.get('userData')
    if (userData) {
      try {
        const parsed = JSON.parse(userData)
        setLoginName(parsed.user_name)
        console.log(parsed)
      } catch (error) {
        console.error('Invalid userData in cookies', error)
      }
    }
  }, []) // <-- empty dependency array, run only once

  return (
    <>
      <Tooltip title='Account settings' arrow>
        <Button
          onClick={handleClick}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
          sx={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px',
            borderRadius: '30px',
            backgroundColor: '#fff',
            '&:hover': {
              backgroundColor: '#e0e7f0'
            }
          }}
        >
          <Avatar
            alt='Alex Morgan'
            sx={{ width: 32, height: 32, marginRight: '8px' }}
          />

          <span
            style={{
              fontSize: '17px',
              fontWeight: '600',
              color: '#000',
              textTransform: 'capitalize'
            }}
          >
            {loginName || 'User'}
          </span>
          <KeyboardArrowDown sx={{ marginLeft: '8px', color: '#000' }} />
        </Button>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        className='account-menu'
      >
        <MenuItem onClick={handleClose}>
          <Link
            href='/admin-profile'
            style={{ textDecoration: 'none', color: 'black' }}
          >
            <Typography component={'span'}> My Profile</Typography>
          </Link>
        </MenuItem>

        <MenuItem onClick={handleChangePasswordClick}>
          <Typography component={'span'}> Change Password</Typography>
        </MenuItem>
        <MenuItem onClick={handleLogoutClick}>
          <Typography component={'span'}> Logout</Typography>
        </MenuItem>
      </Menu>
      <MyModal
        open={logoutModalOpen}
        setOpen={setLogoutModalOpen}
        customStyle=' md-modal'
        modalHeader='true'
        modalTitle='Confirm Logout'
        iconSrc={LogoutIcon}
      >
        <Typography
          variant='body1'
          color='initial'
          fontSize='25px'
          mb={3}
          textAlign='center'
          fontWeight={500}
        >
          Are you sure you want to logout?
        </Typography>
        <div className='md-modal-btns'>
          <CustomButton
            type='button'
            text='Cancel'
            btntrasnparent={true}
            onClick={handleLogoutCancel}
          />
          <CustomButton btnDelete={true} text='Logout' onClick={handleLogout} />
        </div>
      </MyModal>
      <MyModal
        open={changePasswordModalOpen}
        setOpen={setChangePasswordModalOpen}
        customStyle='md-modal'
        modalHeader='true'
        modalTitle='Password Change'
        iconSrc={LogoutIcon} // Replace with a password-specific icon if available
      >
        <ResetPassword />
        <div className='md-modal-btns'>
          <CustomButton
            type='button'
            text='Cancel'
            btntrasnparent={true}
            onClick={handleChangePasswordCancel}
          />
          <CustomButton
            type='button'
            btnDelete={true}
            text='Change Password'
            onClick={handleChangePasswordConfirm}
          />
        </div>
      </MyModal>
    </>
  )
}
