interface InputProps {
  label?: string
  name: string
  type?: "text" | "email" | "password" | "date"
  placeholder: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
}

export const Input = ({
  label,
  name,
  type = "text",
  placeholder,
  onChange,
  error,
}: InputProps) => {
  return (
    <div className='flex flex-col'>
      {label != null && (
        <label className='font-medium' htmlFor={name}>
          {label}
        </label>
      )}
      <input
        className='border px-4 py-2 rounded-md'
        name={name}
        type={type}
        placeholder={placeholder}
        onChange={onChange}
      />
      {error != null && <p className='text-red-500 text-sm'>{error}</p>}
    </div>
  )
}
