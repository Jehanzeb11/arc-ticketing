import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface ReuseableDateRangePickerProps {
  value?: [Date | null, Date | null];
  onChange?: (date: [Date | null, Date | null]) => void;
  className?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  locale?: string;
  format?: string;
}

const ReuseableDateRangePicker: React.FC<ReuseableDateRangePickerProps> = ({
  value = [null, null],
  onChange,
  className = "",
  disabled = false,
  minDate = new Date(2023, 0, 1),
  maxDate = new Date(2025, 11, 31),
  locale = "en-US",
  format = "dd/MM/yyyy",
}) => {
  const handleChange = (newDate: Value) => {
    console.log("raw value from picker:", newDate);

    if (Array.isArray(newDate)) {
      // ✅ full range selected
      onChange?.([newDate[0], newDate[1]]);
    } else {
      // ⏳ only first date clicked
      onChange?.([newDate, null]);
    }
  };

  // react-date-picker expects either a single Date (for a single selection)
  // or an array [startDate, endDate] when returning a range. Passing an
  // array that contains a null end-date can prevent the picker from
  // switching into range mode, so normalize the value we pass to the picker:
  // - if both are null -> null
  // - if only start exists -> start (Date)
  // - if both exist -> [start, end]
  const normalizedValue: Value = (() => {
    const [start, end] = value ?? [null, null];
    if (!start && !end) return null;
    if (start && !end) return start;
    return [start, end];
  })();

  // Calendar props: use an any-typed object to pass runtime-only props
  // (like selectRange) that may not be present in the current TypeScript
  // definitions for react-calendar/react-date-picker.
  const calendarPropsAny = {
    className: "custom-calendar",
    selectRange: true,
  } as any;

  return (
    <div className={`date-picker-container ${className}`}>
      <DatePicker
        returnValue="range"
        onChange={handleChange}
        value={normalizedValue}
        disabled={disabled}
        minDate={minDate}
        maxDate={maxDate}
        locale={locale}
        format={format}
        calendarProps={calendarPropsAny}
        closeCalendar={false} // 👈 keeps calendar open until user manually closes
      />
    </div>
  );
};

export default ReuseableDateRangePicker;
