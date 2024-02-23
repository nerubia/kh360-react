import Datepicker, { type DateValueType } from "react-tailwindcss-datepicker"

interface DateRangePickerProps {
  name: string
  label?: string
  value: DateValueType
  onChange: (value: DateValueType, e?: HTMLInputElement | null | undefined) => void
  start_date_limit?: string | Date | undefined
  end_date_limit?: string | Date | undefined
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  name,
  label,
  value,
  onChange,
  start_date_limit,
  end_date_limit,
}: DateRangePickerProps) => {
  const currentDate = new Date()
  const minDate =
    start_date_limit !== undefined
      ? new Date(start_date_limit)
      : new Date(currentDate.getFullYear() - 50, 0, 1)
  const maxDate =
    end_date_limit !== undefined
      ? new Date(end_date_limit)
      : new Date(currentDate.getFullYear() + 50, 0, 1)

  const containerClassName = (defaultClassName: string) => {
    const customStyle = "border rounded-md mb-10"
    return `${defaultClassName} ${customStyle}`
  }
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
      />
    </div>
  )
}
