interface InputProps {
  label?: string
  name: string
  type?: "text" | "email" | "password" | "date"
  placeholder: string
  value?: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  min?: string
  max?: string
}

export const Input = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  min,
  max,
}: InputProps) => {
  return (
    <div className='flex flex-col'>
      {label != null && (
        <label className='font-medium' htmlFor={name}>
          {label}
        </label>
      )}
      <input
        className={`${
          error != null ? "border-red-500" : ""
        } border px-4 py-2 rounded-md`}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
      />
      {error != null && <p className='text-red-500 text-sm'>{error}</p>}
    </div>
  )
}
