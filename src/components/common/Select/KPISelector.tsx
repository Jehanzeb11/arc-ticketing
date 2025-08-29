'use client'
import React, { useState, useEffect } from 'react'
import {
  Box,
  Popper,
  Checkbox,
  FormControlLabel,
  TextField,
  InputAdornment,
  ClickAwayListener, // 👈 import add
} from '@mui/material'
import Image from 'next/image'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import Button from '../Button/Button'

interface KPISelectorProps {
  onChange: (selectedKPIs: string[]) => void
  selectedKPIs: string[]
  defaultText: string
  icon: any
}

export default function KPISelector({
  onChange,
  selectedKPIs,
  defaultText,
  icon,
}: KPISelectorProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [localSelectedKPIs, setLocalSelectedKPIs] =
    useState<string[]>(selectedKPIs)
  const allKPIs = [
    'Inbound Calls',
    'Outbound Calls',
    'Missed Calls',
    'Queue Size',
    'Dropped Calls',
    'Call in IVR',
    'Agent Status',
    'Agents Waiting',
    'SLA Compliance',
  ]

  useEffect(() => {
    setLocalSelectedKPIs(selectedKPIs)
  }, [selectedKPIs])

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget)
  }

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target
    const updatedKPIs = checked
      ? [...localSelectedKPIs, value]
      : localSelectedKPIs.filter((kpi) => kpi !== value)
    setLocalSelectedKPIs(updatedKPIs)
    onChange(updatedKPIs)
  }

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target
    const updatedKPIs = checked ? allKPIs : []
    setLocalSelectedKPIs(updatedKPIs)
    onChange(updatedKPIs)
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const filteredKPIs = allKPIs.filter((kpi) =>
    kpi.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const applySelection = () => {
    setAnchorEl(null)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box className='kpi-selector'>
      <TextField
        value={
          localSelectedKPIs.length > 0
            ? `${localSelectedKPIs.length} KPIs selected`
            : defaultText
        }
        onClick={handleClick}
        variant='outlined'
        fullWidth
        InputProps={{
          readOnly: true,
          startAdornment: (
            <InputAdornment position='start'>
              <Image src={icon} alt='KPI Icon' width={20} height={20} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position='end'>
              <KeyboardArrowDownIcon />
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#ccc',
              borderRadius: '5px',
            },
            '&:hover fieldset': {
              borderColor: '#888',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#1976d2',
            },
          },
          cursor: 'pointer',
        }}
      />

      <Popper
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        placement='bottom-start'
        sx={{
          zIndex: 1300,
          border: '1px solid #ccc',
          borderRadius: '5px',
          background: '#fff',
          padding: '10px',
          width: '250px',
        }}
        className='kpi-filter-popper'
      >
        <ClickAwayListener onClickAway={handleClose}>
          <Box>
            <TextField
              placeholder='Search KPIs...'
              variant='outlined'
              fullWidth
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{ mb: 2 }}
              className='kpi-filter-search-field'
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={localSelectedKPIs.length === allKPIs.length}
                  onChange={handleSelectAll}
                />
              }
              sx={{
                borderBottom: '1px solid #ccc',
                width: '100%',
                margin: 0,
                mb: '5px',
                pb: '5px',
              }}
              label='Select All'
            />
            <Box sx={{ maxHeight: '200px', overflowY: 'auto' }}>
              {filteredKPIs.map((kpi) => (
                <FormControlLabel
                  sx={{ width: '100%', margin: 0 }}
                  key={kpi}
                  control={
                    <Checkbox
                      value={kpi}
                      checked={localSelectedKPIs.includes(kpi)}
                      onChange={handleCheckboxChange}
                    />
                  }
                  label={kpi}
                />
              ))}
            </Box>
          </Box>
        </ClickAwayListener>
      </Popper>
    </Box>
  )
}
