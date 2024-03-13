import Select, {
  type InputActionMeta,
  type SingleValue,
  type SelectInstance,
  type GroupBase,
} from "react-select"
import { type Option } from "@custom-types/optionType"
import { useMobileView } from "@hooks/use-mobile-view"
import { type Ref } from "react"

interface SelectProps {
  label?: string
  name: string
  value?: Option | null
  onChange: (newValue: SingleValue<Option>) => void
  onInputChange?: (newValue: string, actionMeta: InputActionMeta) => void
  onMenuOpen?: () => void
  options: Option[]
  fullWidth?: boolean
  error?: string | null
  isLoading?: boolean
  customRef?: Ref<SelectInstance<Option, false, GroupBase<Option>>>
  isClearable?: boolean
  disabled?: boolean
  maxMenuHeight?: number
}

export const CustomSelect = ({
  label,
  name,
  value = null,
  onChange,
  onInputChange,
  onMenuOpen,
  options,
  fullWidth,
  error,
  isLoading,
  customRef,
  isClearable,
  disabled,
  maxMenuHeight,
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
        ref={customRef}
        classNames={{
          container: () =>
            `w-full ${error != null ? "border border-red-500 rounded-md" : ""} ${
              fullWidth === true ? "" : "md:w-80"
            }`,
          control: () => "h-38",
        }}
        inputId={name}
        value={value}
        onChange={onChange}
        onInputChange={onInputChange}
        onMenuOpen={onMenuOpen}
        options={options}
        isLoading={isLoading}
        isClearable={isClearable}
        isDisabled={disabled}
        maxMenuHeight={maxMenuHeight}
      />
      {error != null && <p className='text-red-500 text-sm'>{error}</p>}
    </div>
  )
}
