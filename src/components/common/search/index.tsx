import { TextField, InputAdornment } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import React from 'react'
export default function Search ({
  searchQuery,
  handleSearch,
  placeholder,
  searchClass
}: any) {
  return (
    <TextField
      className={`search-field ${searchClass ? searchClass : ''}`}
      fullWidth
      placeholder={placeholder || 'Search'}
      variant='outlined'
      value={searchQuery}
      onChange={handleSearch}
      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 20 } }}
      InputProps={{
        startAdornment: (
          <InputAdornment position='start'>
            <SearchIcon />
          </InputAdornment>
        )
      }}
    />
  )
}
