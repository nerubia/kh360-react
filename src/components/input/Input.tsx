interface InputProps {
  type: string
  placeholder: string
}

export const Input = ({ type, placeholder }: InputProps) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className='border p-2 rounded-md'
    />
  )
}
