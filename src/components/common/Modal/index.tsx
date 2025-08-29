'use client'
import * as React from 'react'
import Backdrop from '@mui/material/Backdrop'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'
import { IconButton, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import Image from 'next/image'
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
}

export default function MyModal (porps: any) {
  const {
    open,
    setOpen,
    children,
    openModal,
    onCloseModal,
    customStyle,
    newClass,
    mySxstyle,
    iconSrc,
    modalTitle,
    modalHeader,
    modalContentStyle,
    modalText
  } = porps

  // const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    if (onCloseModal) {
      onCloseModal()
    }
  }

  return (
    <div className={newClass ? newClass : ''}>
      <span className='modal_open_btn' onClick={handleOpen}>
        {openModal}
      </span>
      <Modal
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
        open={open}
        className={customStyle ? `my-modal ${customStyle}` : 'my-modal'}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        sx={{ mySxstyle }}
        slotProps={{
          backdrop: {
            timeout: 500
          }
        }}
      >
        <Fade in={open} style={modalContentStyle}>
          <Box sx={style} className='my-modal-content'>
            <IconButton
              sx={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'white',
                color: 'var(--pri-color)',
                height: '40px',
                width: '40px',
                '&:hover': {
                  background: 'var(--pri-color)',
                  color: 'white'
                }
              }}
              onClick={handleClose}
              className='closeModal'
            >
              <CloseIcon sx={{ height: '25px', width: '25px' }} />
            </IconButton>
            {modalHeader && (
              <div className='modal-header'>
                <span className='icon'>
                  {iconSrc && <Image src={iconSrc} alt='icon' />}
                </span>
                <Box>
                  <h2>{modalTitle || 'Text'}</h2>
                  <Typography variant='body2' color='white'>
                    {modalText ? modalText : ''}
                  </Typography>
                </Box>
              </div>
            )}

            <Box className='modal-body'>
              {React.isValidElement(children) &&
              typeof children.type !== 'string'
                ? React.cloneElement(children as any, {
                    onCloseModal: handleClose
                  })
                : children}
            </Box>
          </Box>
        </Fade>
      </Modal>
    </div>
  )
}
