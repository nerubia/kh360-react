import Select, { type SingleValue } from "react-select"
import { type Option } from "../../types/optionType"

interface SelectProps {
  label?: string
  name: string
  value?: Option
  onChange: (newValue: SingleValue<Option>) => void
  options: Option[]
}

export const CustomSelect = ({
  label,
  name,
  value,
  onChange,
  options,
}: SelectProps) => {
  return (
    <div className='flex flex-col'>
      {label != null && (
        <label className='font-medium' htmlFor={name}>
          {label}
        </label>
      )}
      <Select
        classNames={{
          container: () => "w-full md:w-40",
          control: () => "h-[38px]",
        }}
        inputId={name}
        value={value}
        onChange={onChange}
        options={options}
      />
    </div>
  )
}
