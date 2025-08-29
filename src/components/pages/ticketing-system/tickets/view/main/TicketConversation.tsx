'use client'
import React from 'react'
import profileImg from '@/assets/images/profile/small-profile.png'

import { Box, Typography, Avatar, Chip, Button } from '@mui/material'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import replyIcon from '@/assets/icons/unibox/ticket/viewpage/reply.svg'
import Image from 'next/image'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import calenderIcon from '@/assets/icons/unibox/ticket/viewpage/calender.svg'
const TicketConversation = ({ conversationData }: any) => {
  return (
    <Box
      sx={{
        p: 2.5,
        backgroundColor: '#fff',
        borderRadius: '10px',
        filter: 'drop-shadow(0px 16.88px 59.079px rgba(86, 89, 146, 0.10))'
      }}
    >
      {/* Ticket Header */}
      <Box
        sx={{
          p: 1.5,
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #e0e0e0'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Image src={replyIcon} alt='icon' style={{ marginRight: '10px' }} />
          <Box>
            <Typography
              sx={{ fontSize: '23px', fontWeight: '600', color: '#000' }}
            >
              Login Issues
            </Typography>
            <Typography sx={{ color: '#666', fontSize: '16px' }}>
              Requested by John Smith • 2025-01-07 09:30 • Assigned to
              <span
                style={{
                  color: 'var(--pri-color)',
                  fontWeight: '600',
                  textDecoration: 'underline'
                }}
              >
                {' '}
                Sarah Wilson
              </span>
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip
            label='Open'
            sx={{
              color: 'var(-pri-color)',
              background: 'transparent',
              borderRadius: '100px',
              border: '1px solid var(--border-color)'
            }}
          />
          <Chip
            label='High'
            sx={{
              borderRadius: '100px',
              backgroundColor: 'var(--pri-light-color)',
              color: 'var(-pri-color)'
            }}
          />
        </Box>
      </Box>

      {/* Conversation Messages */}
      {conversationData.map(message => (
        <Box
          key={message.id}
          sx={{
            backgroundColor: '#fff',
            borderRadius: 1,
            p: 1.5,
            mb: 1.5,
            display: 'flex',
            alignItems: 'flex-start',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Avatar
            alt={message.name}
            src={profileImg.src}
            sx={{ width: 40, height: 40, mr: 1.5 }}
          />
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              sx={{ fontSize: '18px', fontWeight: '500', color: '#333' }}
            >
              {message.name}{' '}
              <span style={{ fontSize: '14px', color: '#666' }}>
                {message.email}
              </span>
            </Typography>
            <Typography variant='body2' sx={{ color: '#565656', mt: 0.5 }}>
              {message.message}
            </Typography>
            {message.attachment && (
              <Button
                variant='outlined'
                startIcon={<AttachFileIcon />}
                sx={{
                  mt: 1,
                  borderColor: 'var(--border-color)',
                  color: 'var(--pri-color)',
                  textTransform: 'none',
                  borderRadius: '3px',
                  border: '1px solid var(--border-color)',

                  background: 'var(--pri-light-color)'
                }}
              >
                {message.attachment}{' '}
                <FileDownloadIcon sx={{ color: 'var(--pri-color)', ml: 1 }} />
              </Button>
            )}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
            <Image
              src={calenderIcon}
              alt='icon'
              style={{ marginRight: '10px' }}
            />
            <Typography variant='caption' sx={{ color: '#666' }}>
              {message.date}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  )
}

export default TicketConversation
