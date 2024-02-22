import Datepicker, { type DateValueType } from "react-tailwindcss-datepicker"

interface DateRangePickerProps {
  name: string
  label?: string
  value: DateValueType
  onChange: (value: DateValueType, e?: HTMLInputElement | null | undefined) => void
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  name,
  label,
  value,
  onChange,
}: DateRangePickerProps) => {
  const currentDate = new Date()
  const minDate = new Date(currentDate)
  minDate.setFullYear(currentDate.getFullYear() - 50)
  const maxDate = new Date(currentDate)
  maxDate.setFullYear(currentDate.getFullYear() + 50)

  const containerClassName = (defaultClassName: string) => {
    const customStyle = "border rounded-md"
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
