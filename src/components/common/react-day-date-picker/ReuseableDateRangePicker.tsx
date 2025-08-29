'use client'
import React, { useState } from 'react'
import DateRangePicker from '@wojtekmaj/react-daterange-picker'
import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css'
import 'react-calendar/dist/Calendar.css'

type ValuePiece = Date | null
type Value = [ValuePiece, ValuePiece]

interface ReuseableDateRangePickerProps {
  value?: Value
  onChange?: (date: Value) => void
  className?: string
  disabled?: boolean
  minDate?: Date
  maxDate?: Date
  locale?: string
  format?: string
}

const ReuseableDateRangePicker: React.FC<ReuseableDateRangePickerProps> = ({
  value,
  onChange,
  className = '',
  disabled = false,
  minDate,
  maxDate,
  locale = 'en-US',
  format = 'dd/MM/yyyy',
}) => {
  const [dateValue, setDateValue] = useState<Value>(value || [null, null])

  const handleChange = (newDate: Value) => {
    setDateValue(newDate)
    if (onChange) {
      onChange(newDate)
    }
  }

  return (
    <div className={`date-picker-container ${className}`}>
      <DateRangePicker
        onChange={handleChange}
        value={dateValue}
        disabled={disabled}
        minDate={minDate}
        maxDate={maxDate}
        locale={locale}
        format={format}
        calendarClassName='custom-calendar'
      />
    </div>
  )
}

export default ReuseableDateRangePicker
