import React, { useState } from 'react'
import { Box, Button, MenuItem, Select, Input } from '@mui/material'
import flag from '@/assets/icons/DashboardPopups/Dailer/flag.svg'
import Image from 'next/image'

export default function CountrySelect () {
  const [selectedCountry, setSelectedCountry] = useState('+1')
  const [phoneNumber, setPhoneNumber] = useState('')
  const countryCodes = [
    { code: '+61', flag: flag },
    { code: '+1', flag: flag },
    { code: '+44', flag: flag },
    { code: '+91', flag: flag }
  ]

  const handlePhoneChange = e => {
    setPhoneNumber(e.target.value)
  }

  return (
    <Box
      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
      className='country-select'
    >
      <Select
        value={selectedCountry}
        onChange={e => setSelectedCountry(e.target.value)}
        className='select-country'
        sx={{ minWidth: 100 }}
      >
        {countryCodes.map((country, index) => (
          <MenuItem key={index} value={country.code}>
            <Box
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              className='country-item'
            >
              <Image
                src={country.flag}
                alt='flag'
                style={{ width: '20px', height: '20px' }}
              />
              {country.code}
            </Box>
          </MenuItem>
        ))}
      </Select>
      <Input
        type='tel'
        value={phoneNumber}
        onChange={handlePhoneChange}
        // placeholder="Enter phone number"
        sx={{ flexGrow: 1, padding: '8px' }}
        inputProps={{ 'aria-label': 'Phone number input' }}
      />
    </Box>
  )
}
