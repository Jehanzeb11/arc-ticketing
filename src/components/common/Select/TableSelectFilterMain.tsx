'use client'
import { Autocomplete, TextField, Box, Popper, MenuItem } from '@mui/material'
import React from 'react'
import Image from 'next/image'
// interface Option {
//   value: string;
//   label: string;
//   icon?: string; // Add icon property to the option interface
// }
// interface TableSelectFilterMainNewProps {
//   onChange: (event: any) => void;
//   value?: string;
//   name?: string;
//   options?: Option[];
//   className?: string;
//   defaultText?: string;
//   menuItemSx?: any;
//   popperClassName?: string;
// }
export default function TableSelectFilterMainNew ({
  onChange,
  value = '',
  name = '',
  options = [],
  className = '',
  defaultText = 'Select an option',
  menuItemSx,
  popperClassName
}: any) {
  const selectedOption = options?.find(option => option.value === value) || null

  const [open, setOpen] = React.useState(true)
  const CustomPopper = (props: any) => {
    return (
      <Popper
        {...props}
        className={`custom-autocomplete-popper department-filter ${
          popperClassName || ''
        }`}
        // sx={{
        //   '& .MuiAutocomplete-listbox': {
        //     maxHeight: '200px'
        //   }
        // }}
      />
    )
  }
  return (
    <Box className={`my-select pri-border  ${className ? className : ''}`}>
      <Autocomplete
        options={options || []}
        getOptionLabel={option => option.label || defaultText}
        value={selectedOption}
        PopperComponent={CustomPopper}
        // open={open}
        // onOpen={() => setOpen(true)}
        onChange={(event, newValue) => {
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
            InputProps={{
              ...params.InputProps,
              startAdornment: selectedOption?.icon ? (
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                  <Image
                    src={selectedOption.icon}
                    alt={`${selectedOption.label} icon`}
                    width={20}
                    height={20}
                    style={{ objectFit: 'contain' }}
                  />
                </Box>
              ) : null,
              endAdornment: params.InputProps.endAdornment
            }}
          />
        )}
        renderOption={(props, option, index) => (
          <MenuItem
            {...props}
            key={`${option.value}-${index}`}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              ...menuItemSx
            }}
          >
            {option.icon && (
              <Image
                src={option.icon}
                alt={`${option.label} icon`}
                width={20}
                height={20}
                style={{ objectFit: 'contain' }}
              />
            )}
            {option.label}
          </MenuItem>
        )}
        isOptionEqualToValue={(option, val) => option.value === val?.value}
        className='autocomplete-select '
      />
    </Box>
  )
}
