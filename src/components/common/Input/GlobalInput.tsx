import { Box } from '@mui/material'
import Image from 'next/image'
import React from 'react'

// Forward ref for react-hook-form to properly manage input refs
const GlobalInput = React.forwardRef<HTMLInputElement, any>(
  (
    {
      placeholder,
      type,
      name,
      required,
      srcImg,
      className,
      readOnly,
      label,
      sx,
      onBlur,
      explanationText,
      accept = false,
      // The rest props from react-hook-form (ref, onChange, value, etc.)
      ...rest
    },
    ref
  ) => {
    return (
      <Box
        sx={{ display: 'flex', flexDirection: 'column', gap: 1, ...sx }}
        className={`input-parent ${className ? className : ''}`}
      >
        <label htmlFor={name}>{label}</label>
        <Box>
          <input
            type={type}
            name={name}
            ref={ref} // Pass the ref from react-hook-form
            className='form-control'
            placeholder={placeholder}
            readOnly={readOnly}
            accept={accept}
            {...rest} // Spread the rest of the props like value, onChange, etc.
          />
          {srcImg && <Image src={srcImg} alt='icon' className='icon' />}
        </Box>
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
)

// This is necessary for forwarding refs to work
GlobalInput.displayName = 'GlobalInput'

export default GlobalInput
