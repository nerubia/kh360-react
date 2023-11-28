interface InputProps {
  label?: string
  name: string
  type?: "text" | "email" | "password" | "date"
  placeholder: string
  value?: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (event: React.ChangeEvent<HTMLInputElement>) => void
  error?: string | null
  min?: string
  max?: string
  autoFocus?: boolean
}

export const Input = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  min,
  max,
  autoFocus,
}: InputProps) => {
  return (
    <div className='flex flex-col'>
      {label != null && (
        <label className='font-medium' htmlFor={name}>
          {label}
        </label>
      )}
      <input
        className={`${error != null ? "border-red-500" : ""} border px-4 py-1.5 rounded-md`}
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        min={min}
        max={max}
        autoFocus={autoFocus}
      />
      {error != null && <p className='text-red-500 text-sm'>{error}</p>}
    </div>
  )
}
