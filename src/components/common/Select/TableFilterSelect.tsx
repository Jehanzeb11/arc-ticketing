import React, { useState } from 'react'
import { Select, MenuItem } from '@mui/material'

function TableFilterSelect ({
  options,
  defaultText,
  className,
  value,
  onChange
}) {
  const [internalValue, setInternalValue] = useState(value || '')

  const handleChange = event => {
    setInternalValue(event.target.value)
    if (onChange) {
      onChange(event)
    }
  }

  return (
    <Select
      className={className || 'table-filter-select my-select'}
      value={value !== undefined ? value : internalValue}
      onChange={handleChange}
      variant='outlined'
      displayEmpty
      renderValue={selected => {
        if (!selected) {
          return <span>{defaultText}</span>
        }
        const selectedOption = options.find(option => option.value === selected)
        return selectedOption ? selectedOption.label : ''
      }}
    >
      {options.map(option => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  )
}

export default TableFilterSelect
