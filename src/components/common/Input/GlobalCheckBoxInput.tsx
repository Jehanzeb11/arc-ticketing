'use client'

import React from 'react'
import {
  Checkbox,
  FormControlLabel,
  IconButton,
  Tooltip,
  Typography
} from '@mui/material'
import InfoIcon from '@/assets/icons/modal/info.svg'
import Image from 'next/image'
import { useController, Control, FieldValues } from 'react-hook-form'

interface Option {
  label: string
  value: string
}

interface GlobalCheckBoxInputProps<T extends FieldValues> {
  options: Option[]
  name: string
  control: Control<T>
  rules?: any
  showTooltip?: boolean
  tooltipTitles?: string[]
  isMultiSelect?: boolean
  disabled?: boolean
  className?: string
  showOptionText?: boolean
  optionTextMap?: Record<string, string> // New prop for option text mapping
}

const GlobalCheckBoxInput = <T extends FieldValues>({
  options,
  name,
  control,
  rules,
  showTooltip = false,
  tooltipTitles = [],
  isMultiSelect = false,
  disabled = false,
  className = '',
  showOptionText = false,
  styleCheckBox,
  optionTextMap = {} // Default to empty object
}: GlobalCheckBoxInputProps<T>) => {
  if (!control) {
    console.error(
      `Control is undefined for GlobalCheckBoxInput with name: ${name}`
    )
    return (
      <div className='checkbox-container'>
        <p style={{ color: '#B80505' }}>
          Error: Form control is not initialized.
        </p>
      </div>
    )
  }

  const { field, fieldState } = useController({
    name,
    control,
    defaultValue: (isMultiSelect ? [] : false) as any,
    rules: {
      ...rules,
      validate: isMultiSelect
        ? (value: string[]) =>
            rules?.validate?.(value) ??
            (value.length > 0 || rules?.required || true)
        : rules?.validate
    }
  })

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isMultiSelect) {
      const value = event.target.value
      const isChecked = event.target.checked
      const currentValue = Array.isArray(field.value) ? field.value : []
      const updatedValue = isChecked
        ? [...currentValue, value]
        : currentValue.filter((item: string) => item !== value)
      field.onChange(updatedValue)
    } else {
      field.onChange(event.target.checked)
    }
  }

  const isSingleColumn = isMultiSelect ? options.length <= 5 : true
  const midPoint = Math.ceil(options.length / 2)
  const leftColumnOptions = isSingleColumn
    ? options
    : options.slice(0, midPoint)
  const rightColumnOptions = isSingleColumn ? [] : options.slice(midPoint)

  return (
    <div
      className={`checkbox-container ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: isSingleColumn ? '1fr' : 'repeat(2, 225px)',
        gap: '20px'
      }}
    >
      <div className='checkbox-column'>
        {leftColumnOptions.map((item, index) => (
          <div
            key={`${name}-${item.value}-${index}`}
            className={`checkbox-item ${styleCheckBox ? styleCheckBox : ''}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  id={`${name}-${item.label}-${index}`}
                  value={item.value}
                  checked={
                    isMultiSelect
                      ? Array.isArray(field.value) &&
                        field.value.includes(item.value)
                      : field.value
                  }
                  onChange={handleCheckboxChange}
                  disabled={disabled}
                />
              }
              label={item.label}
            />
            {showTooltip && tooltipTitles[index] && (
              <Tooltip title={tooltipTitles[index]}>
                <IconButton size='small'>
                  <Image src={InfoIcon} alt='Info' width={16} height={16} />
                </IconButton>
              </Tooltip>
            )}
            {showOptionText && optionTextMap[item.value] && (
              <Typography
                sx={{
                  color: 'rgba(0, 0, 0, 0.5)',
                  fontSize: '15px',
                  lineHeight: '20px',
                  textTransform: 'capitalize'
                }}
              >
                {optionTextMap[item.value]}
              </Typography>
            )}
          </div>
        ))}
      </div>
      {!isSingleColumn && isMultiSelect && (
        <div className='checkbox-column'>
          {rightColumnOptions.map((item, index) => (
            <div
              key={`${name}-${item.value}-${index + midPoint}`}
              className='checkbox-item'
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    id={`${name}-${item.label}-${index + midPoint}`}
                    value={item.value}
                    checked={
                      Array.isArray(field.value) &&
                      field.value.includes(item.value)
                    }
                    onChange={handleCheckboxChange}
                    disabled={disabled}
                  />
                }
                label={item.label}
              />
              {showTooltip && tooltipTitles[index + midPoint] && (
                <Tooltip title={tooltipTitles[index + midPoint]}>
                  <IconButton size='small'>
                    <Image src={InfoIcon} alt='Info' width={16} height={16} />
                  </IconButton>
                </Tooltip>
              )}
              {showOptionText && optionTextMap[item.value] && (
                <Typography
                  sx={{
                    color: 'rgba(0, 0, 0, 0.5)',
                    fontSize: '15px',
                    lineHeight: '20px',
                    textTransform: 'capitalize'
                  }}
                >
                  {optionTextMap[item.value]}
                </Typography>
              )}
            </div>
          ))}
        </div>
      )}
      {fieldState.error && (
        <p
          style={{
            color: '#B80505',
            margin: '10px 0 0 0',
            gridColumn: '1 / -1'
          }}
        >
          {fieldState.error.message}
        </p>
      )}
    </div>
  )
}

export default GlobalCheckBoxInput
