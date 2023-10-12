interface TextAreaInterface {
  label?: string
  name: string
  placeholder: string
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  error?: string
}

export const TextArea = ({
  label,
  name,
  placeholder,
  onChange,
  error,
}: TextAreaInterface) => {
  return (
    <div className='flex flex-col'>
      {label != null && (
        <label className='font-medium' htmlFor={name}>
          {label}
        </label>
      )}
      <textarea
        className='w-full p-4 border rounded-md resize-none'
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        rows={5}
      ></textarea>
      {error != null && <p className='text-red-500 text-sm'>{error}</p>}
    </div>
  )
}
