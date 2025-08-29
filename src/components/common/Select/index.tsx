'use client'

import { Autocomplete, TextField, Box, Popper, CircularProgress } from '@mui/material'
import React from 'react'
import Image from 'next/image'

interface Option {
  label: string
  value: string
  description?: string
  icon?: any // Icon source (e.g., SVG import)
}

interface FormSelectProps {
  onChange: (event: any) => void
  value?: string
  label?: string
  name?: string
  description?: string
  options?: Option[]
  className?: string
  explanationText?: string | boolean
  defaultText?: string
  popperClassName?: string
  loading?: boolean
  disabled?: boolean
  sx?: any
}

export default function FormSelect ({
  onChange,
  value = '',
  label = '',
  name = '',
  description = '',
  options = [],
  className = '',
  explanationText = false,
  defaultText = '',
  disabled = false,
  sx,
  popperClassName,
  loading = false
}: FormSelectProps) {
  // Find the selected option to display its label
  const selectedOption = options?.find(option => option.value === value)

  const CustomPopper = (props: any) => {
    return (
      <Popper
        {...props}
        className={`custom-autocomplete-popper ${popperClassName || ''}`}
      />
    )
  }

  return (
    <Box className={`my-select ${className ? className : ''}`} sx={{ ...sx }}>
      <span className='select-label'>{label}</span>
      <Autocomplete
        options={options || []}
        getOptionLabel={option => option.label || defaultText}
        value={selectedOption || null}
        PopperComponent={CustomPopper}
        onChange={(event, newValue) => {
          console.log('Autocomplete onChange', { newValue })
          onChange({
            target: {
              name,
              value: newValue ? newValue.value : ''
            }
          })
        }}
        renderInput={params => (
          <TextField
            {...params}
            placeholder={defaultText}
            variant='outlined'
            className='form-select'
            fullWidth
            margin='normal'
            disabled={disabled || loading}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
        renderOption={(props, option) => (
          <li
            {...props}
            key={option.value}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {option.icon && (
                <Image
                  src={option.icon.src}
                  alt={`${option.label} icon`}
                  width={20}
                  height={20}
                />
              )}
              <span>{option.label}</span>
            </Box>
            {option.description && (
              <span style={{ color: '#00000033' }}>({option.description})</span>
            )}
          </li>
        )}
        isOptionEqualToValue={(option, val) => option.value === val?.value}
        className='autocomplete-select'
        disabled={disabled || loading}
      />
      {explanationText && (
        <p
          className='explanation-text'
          style={{ color: '#666', marginTop: '4px', fontSize: '12px' }}
        >
          {explanationText}
        </p>
      )}
    </Box>
  )
}
