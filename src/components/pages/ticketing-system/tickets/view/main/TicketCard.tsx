'use client'
import React from 'react'
import { Box, Typography, Chip, Avatar } from '@mui/material'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import { styled } from '@mui/material/styles'
import profileImg from '@/assets/images/profile/small-profile.png'

const CardContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  // alignItems: "center",
  flexDirection: 'column',
  padding: '15px',
  // py: "13px",
  backgroundColor: 'white',
  borderRadius: '10px',
  filter: 'drop-shadow(0px 16.88px 59.079px rgba(86, 89, 146, 0.10))',
  boxShadow: 'none',
  width: '100%',
  maxWidth: '400px',
  marginBottom: '15px'
}))

const ContentBox = styled(Box)(({ theme }) => ({
  marginLeft: theme.spacing(2),
  flexGrow: 1
}))

const StatusBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1)
}))

const TicketCard = ({
  ticketId,
  status,
  title,
  name,
  date,
  imageUrl,
  priority
}: any) => {
  return (
    <CardContainer>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          mb: '5px'
        }}
      >
        <Typography
          variant='body1'
          sx={{ fontWeight: 'bold', color: '#33333396' }}
        >
          {ticketId}
        </Typography>
        <StatusBox>
          <Chip
            key={status}
            label={status}
            sx={{
              color: `${
                status === 'Open'
                  ? 'var(--pri-color)'
                  : status === 'Closed'
                  ? 'rgba(136, 136, 136, 1)'
                  : status === 'In-progress'
                  ? '#C26616'
                  : status == 'Resolved'
                  ? '#32AAB1'
                  : '#888888'
              }`,
              borderRadius: '30px',
              fontWeight: '500',
              border: `1px solid ${
                status === 'Open'
                  ? 'var(--pri-color)'
                  : status === 'closed'
                  ? 'rgba(136, 136, 136, 1)'
                  : status === 'in-progress'
                  ? '#C26616'
                  : status === 'resolved'
                  ? '#32AAB1'
                  : '#888888'
              }   `,
              backgroundColor: 'transparent',
              height: '25px',
              fontSize: '12px'
            }}
          />
          <Chip
            key={priority}
            label={priority}
            sx={{
              color: `${
                priority === 'High'
                  ? 'var(--pri-color)'
                  : priority === 'Medium'
                  ? '#FDC748'
                  : priority === 'Low'
                  ? '#888888'
                  : priority === 'Urgent'
                  ? '#E33629'
                  : '#888888'
              }`,
              borderRadius: '30px',
              fontWeight: '500',
              border: '1px solid transparent',
              backgroundColor:
                priority === 'High'
                  ? 'rgba(50, 170, 177, 0.15)'
                  : priority === 'Low'
                  ? 'rgba(136, 136, 136, 0.15)'
                  : priority === 'Urgent'
                  ? 'rgba(227, 54, 41, 0.15)'
                  : 'rgba(253, 199, 72, 0.15)',
              height: '25px',
              fontSize: '12px'
            }}
          />
        </StatusBox>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'start', flexGrow: 1 }}>
        <Avatar
          alt={name}
          src={profileImg.src}
          sx={{ width: 35, height: 35 }}
        />
        <ContentBox>
          <Typography
            variant='body1'
            sx={{ fontWeight: '500', fontSize: '17px', mb: 0.3 }}
          >
            {title}
          </Typography>
          <Typography sx={{ fontSize: '14px', fontWeight: '400' }}>
            {name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
            <CalendarTodayIcon sx={{ fontSize: 14, color: '#666', mr: 0.5 }} />
            <Typography
              variant='caption'
              color='text.secondary'
              sx={{ fontSize: '12px' }}
            >
              {date}
            </Typography>
          </Box>
        </ContentBox>
      </Box>
    </CardContainer>
  )
}

export default TicketCard
