import { useState } from 'react';
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface ReuseableDatePickerProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  className?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  locale?: string;
  format?: string;
}

const ReuseableDatePicker: React.FC<ReuseableDatePickerProps> = ({
  value,
  onChange,
  className = '',
  disabled = false,
  minDate,
  maxDate,
  locale = 'en-US',
  format = 'dd/MM/yyyy',
}) => {
  const [dateValue, setDateValue] = useState<Value>(value || null);

  const handleChange = (newDate: Value) => {
    setDateValue(newDate);
    if (onChange) {
      onChange(newDate as Date | null);
    }
  };

  return (
    <div className={`date-picker-container ${className}`}>
      <DatePicker
        onChange={handleChange}
        value={dateValue}
        disabled={disabled}
        minDate={minDate}
        maxDate={maxDate}
        locale={locale}
        format={format}
        calendarClassName="custom-calendar"
      />
    </div>
  );
};

export default ReuseableDatePicker;