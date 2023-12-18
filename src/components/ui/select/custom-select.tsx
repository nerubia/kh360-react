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
  error?: string | null
}

export const CustomSelect = ({
  label,
  name,
  value,
  onChange,
  onInputChange,
  options,
  fullWidth,
  error,
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
          container: () =>
            `w-full ${error != null ? "border border-red-500 rounded-md" : ""} ${
              fullWidth === true ? "" : "md:w-40"
            }`,
          control: () => "h-[38px]",
        }}
        inputId={name}
        value={value}
        onChange={onChange}
        onInputChange={onInputChange}
        options={options}
      />
      {error != null && <p className='text-red-500 text-sm'>{error}</p>}
    </div>
  )
}
