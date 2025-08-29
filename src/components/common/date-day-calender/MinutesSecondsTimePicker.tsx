import * as React from 'react'
import { DemoItem } from '@mui/x-date-pickers/internals/demo'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import { Controller } from 'react-hook-form'

interface MinutesSecondsTimePickerProps {
  label: string
  name: string
  control: any
  rules?: any
}

export default function MinutesSecondsTimePicker ({
  label,
  name,
  control,
  rules
}: MinutesSecondsTimePickerProps) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <DemoItem label={label}>
          <TimePicker
            views={['minutes', 'seconds']}
            format='mm:ss'
            value={field.value}
            onChange={newValue => field.onChange(newValue)}
            slotProps={{
              textField: {
                error: !!error,
                helperText: error?.message
              }
            }}
          />
        </DemoItem>
      )}
    />
  )
}
