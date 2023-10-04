interface InputProps {
  name: string
  type: string
  placeholder: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
}

export const Input = ({
  name,
  type,
  placeholder,
  onChange,
  error,
}: InputProps) => {
  return (
    <div className='flex flex-col'>
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
