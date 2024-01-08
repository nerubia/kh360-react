import { type InputActionMeta, type SingleValue } from "react-select"
import CreatableSelect from "react-select/creatable"
import { type Option } from "../../../types/optionType"

interface SelectProps {
  label?: string
  name: string
  value?: Option
  onChange: (newValue: SingleValue<Option>) => void
  onInputChange?: (newValue: string, actionMeta: InputActionMeta) => void
  options: Option[]
  fullWidth?: boolean
  isClearable?: boolean
  error?: string | null
}

export const CreateSelect = ({
  label,
  name,
  value,
  onChange,
  onInputChange,
  options,
  fullWidth,
  error,
  isClearable,
}: SelectProps) => {
  return (
    <div className='flex flex-col'>
      {label != null && (
        <label className='font-medium' htmlFor={name}>
          {label}
        </label>
      )}
      <CreatableSelect
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
        isClearable={isClearable}
      />
      {error != null && <p className='text-red-500 text-sm'>{error}</p>}
    </div>
  )
}
