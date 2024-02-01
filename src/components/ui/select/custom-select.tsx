import Select, { type InputActionMeta, type SingleValue } from "react-select"
import { type Option } from "../../../types/optionType"
import { useMobileView } from "../../../hooks/use-mobile-view"
interface SelectProps {
  label?: string
  name: string
  value?: Option
  onChange: (newValue: SingleValue<Option>) => void
  onInputChange?: (newValue: string, actionMeta: InputActionMeta) => void
  options: Option[]
  fullWidth?: boolean
  error?: string | null
  isLoading?: boolean
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
  isLoading,
}: SelectProps) => {
  const isMobile = useMobileView()

  return (
    <div className='flex flex-col'>
      {label != null && (
        <label
          className={`whitespace-nowrap ${isMobile ? "text-sm" : "font-medium"}`}
          htmlFor={name}
        >
          {label}
        </label>
      )}
      <Select
        classNames={{
          container: () =>
            `w-full ${error != null ? "border border-red-500 rounded-md" : ""} ${
              fullWidth === true ? "" : "md:w-40"
            }`,
          control: () => "h-38",
        }}
        inputId={name}
        value={value}
        onChange={onChange}
        onInputChange={onInputChange}
        options={options}
        isLoading={isLoading}
      />
      {error != null && <p className='text-red-500 text-sm'>{error}</p>}
    </div>
  )
}
