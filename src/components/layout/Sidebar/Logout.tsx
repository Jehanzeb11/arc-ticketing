import { Button, Typography } from '@mui/material'
import Image from 'next/image'
import React from 'react'
import LogoutIcon from '@/assets/icons/navigation/logout.svg'
import { t } from 'i18next'
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'
import MyModal from '@/components/common/Modal'
import CustomButton from '@/components/common/Button/Button' // Assuming Button component is imported from your custom library

export default function Logout ({ open }) {
  const [logoutModalOpen, setLogoutModalOpen] = React.useState(false)

  const handleLogout = () => {
    Cookies.remove('userData')
    toast.success('Logout Successful!')
    setTimeout(() => {
      window.location.reload()
    }, 100)
  }
  const handleLogoutCancel = () => {
    setLogoutModalOpen(false)
  }
  const handleLogoutClick = () => {
    // setAnchorEl(null)
    setLogoutModalOpen(true)
  }
  return (
    <>
      <Button
        sx={{
          fontSize: '15px',
          color: '#00000050',
          textTransform: 'capitalize',
          padding: `${open ? '10px 20px' : '7px'}`,
          position: 'fixed',
          bottom: '40px',
          left: `${open ? '20px' : '0px'}`
        }}
        className='logout-btn'
        onClick={handleLogoutClick}
      >
        <Image src={LogoutIcon} alt='icon' />
        {open && <span>{t('logout')}</span>}
      </Button>
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
    </>
  )
}
