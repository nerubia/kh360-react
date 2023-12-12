import Select, { type InputActionMeta, type SingleValue } from "react-select"
import { type Option } from "../../../types/optionType"

interface SelectProps {
  label?: string
  name: string
  value?: Option
  onChange: (newValue: SingleValue<Option>) => void
  onInputChange?: (newValue: string, actionMeta: InputActionMeta) => void
  options: Option[]
  fullWidth?: boolean
}

export const CustomSelect = ({
  label,
  name,
  value,
  onChange,
  options,
  fullWidth,
  onInputChange,
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
          container: () => `w-full ${fullWidth === true ? "" : "md:w-40"}`,
          control: () => "h-[38px]",
        }}
        inputId={name}
        value={value}
        onChange={onChange}
        onInputChange={onInputChange}
        options={options}
      />
    </div>
  )
}
