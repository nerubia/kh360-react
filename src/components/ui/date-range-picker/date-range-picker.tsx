import Datepicker, { type DateValueType } from "react-tailwindcss-datepicker"

interface DateType {
  start_date?: string | null
  end_date?: string | null
}

interface DateRangePickerProps {
  name?: string
  label?: string
  value: DateValueType
  onChange: (value: DateValueType, e?: HTMLInputElement | null | undefined) => void
  error?: DateType | null
  dateLimit?: DateType | null
  disabled?: boolean
  useRange?: boolean
  asSingle?: boolean
  reopenMinDate?: Date
  reopenError?: boolean
  readOnly?: boolean
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  name,
  label,
  value,
  onChange,
  error,
  dateLimit,
  disabled,
  useRange,
  asSingle,
  reopenMinDate,
  reopenError,
  readOnly,
}: DateRangePickerProps) => {
  const currentDate = new Date()

  const parseDate = (dateString: string | null): Date => {
    return dateString != null ? new Date(dateString) : new Date()
  }

  let minDate: Date
  if (reopenMinDate != null) {
    minDate = new Date(reopenMinDate)
  } else {
    minDate =
      dateLimit?.start_date != null
        ? parseDate(dateLimit.start_date)
        : new Date(currentDate.getFullYear() - 50, 0, 1)
  }
  const maxDate =
    dateLimit?.end_date != null
      ? parseDate(dateLimit.end_date)
      : new Date(currentDate.getFullYear() + 50, 11, 31)

  const containerClassName = (defaultClassName: string) => {
    const customStyle =
      error?.start_date !== undefined || error?.end_date !== undefined ? "border-red-500" : ""
    const reopenValidation = reopenError === true ? "border-red-500" : ""
    return `${defaultClassName} border rounded-md ${customStyle} ${reopenValidation}`
  }

  const isErrorPresent =
    error != null &&
    (error.start_date !== null || error.end_date !== null) &&
    (error.start_date !== undefined || error.end_date !== undefined)

  const sameDateErrorMessage = error?.start_date === error?.end_date

  return (
    <div>
      {label != null && (
        <label className='font-medium' htmlFor={name}>
          {label}
        </label>
      )}
      <Datepicker
        inputId={name}
        inputName={name}
        primaryColor={"blue"}
        value={value}
        onChange={onChange}
        showShortcuts={true}
        popoverDirection='down'
        configs={{
          shortcuts: {},
        }}
        minDate={minDate}
        maxDate={maxDate}
        containerClassName={containerClassName}
        disabled={disabled}
        useRange={useRange}
        asSingle={asSingle}
        readOnly={readOnly}
      />
      {reopenError === true && (
        <p className='text-red-500 text-sm font-normal'>Date is required.</p>
      )}
      {isErrorPresent && (
        <p className='text-red-500 text-sm font-normal'>
          {sameDateErrorMessage
            ? `${error?.start_date != null ? error.start_date : ""}`.trim()
            : `${error?.start_date != null ? error.start_date : ""}${
                error?.start_date != null && error?.end_date != null ? ", " : ""
              }${error?.end_date != null ? error.end_date : ""}`.trim()}
        </p>
      )}
    </div>
  )
}
