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
  return (
    <div>
      {label != null && (
        <label className='font-medium' htmlFor={name}>
          {label}
        </label>
      )}
      <div className='border rounded-md'>
        <Datepicker
          inputId={name}
          inputName={name}
          primaryColor={"blue"}
          value={value}
          onChange={onChange}
          showShortcuts={true}
          popoverDirection='down'
          placeholder='yyyy/mm/dd'
        />
      </div>
    </div>
  )
}
