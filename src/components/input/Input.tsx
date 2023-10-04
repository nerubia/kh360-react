interface InputProps {
  type: string
  placeholder: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const Input = ({ type, placeholder, onChange }: InputProps) => {
  return (
    <input
      className='border px-4 py-2 rounded-md'
      type={type}
      placeholder={placeholder}
      onChange={onChange}
    />
  )
}
