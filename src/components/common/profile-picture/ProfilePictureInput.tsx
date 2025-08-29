'use client'
import { Box, Typography } from '@mui/material'
import React from 'react'

interface ProfilePictureInputProps {
  onChange: (file: File | null) => void
  value: File | null
  error?: string
}

export const ProfilePictureInput = ({
  onChange,
  value,
  error,
}: ProfilePictureInputProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    onChange(file)
  }

  return (
    <Box>
      <Typography
        variant='body1'
        sx={{
          color: '#00000069',
          fontSize: '16px',
          fontStyle: 'normal',
          fontWeight: 400,
          lineHeight: '26px', // 162.5%
          mb: '7px',
        }}
      >
        Profile Picture
      </Typography>
      <label
        style={{
          border: '1px solid #00000015',
          padding: '15px',
          borderRadius: '10px',
          width: '100%',
          backgroundColor: '#cecece15',
          display: 'block',
          cursor: 'pointer',
        }}
      >
        <input
          type='file'
          accept='image/*'
          onChange={handleFileChange}
          style={{ display: 'none' }} // Hide the default input
        />
        <span style={{ color: '#555', fontSize: '14px' }}>
          {value
            ? `Selected file: ${value.name}`
            : 'Choose File No file chosen'}
        </span>
      </label>
      {error && (
        <Typography variant='caption' color='error' sx={{ mt: -1, ml: 1 }}>
          {error}
        </Typography>
      )}
    </Box>
  )
}
